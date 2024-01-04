
import os
import math
import random
import sqlite3
from flask import Flask,render_template,request,jsonify,send_from_directory,redirect
from werkzeug.utils import secure_filename
from werkzeug.security import safe_join
import json
import datetime

import argparse
import utils.database_handler
from utils.database_handler import dbhandle
from utils.api import APIHandler



LAST_REQUEST_TIME = None

RESERVEDPATIENTNUMS = []

askers = {'meds':{'table':'MEDS','display':'NAME,POTENCY','searchby':'NAME'}
          ,'medium':{'table':'MEDIUM','display':'NAME','searchby':'NAME'},
          'container':{'table':'SIZE','display':'QTY,UNIT','searchby':'QTY'}}


def check_patientnum(patientnum):
    conn = dbhandle(True)
    f = conn.execute("select MAX(PATIENTNO) FROM PATIENTS")
    f = [i for i in f][0][0]
    datefmt = datetime.datetime.today().date().strftime("%y%m")

    if f == patientnum:
        f = f.split('N')
        newnum = int(f[1]) + 1

        strnum = f'{datefmt}N{newnum:03}'
        return strnum
    
    else:
        return patientnum



def patientnum():
    conn = dbhandle(True)
    datefmt = datetime.datetime.today().date().strftime("%y%m")

    f = conn.execute("select MAX(PATIENTNO) FROM PATIENTS")
    f = [i for i in f][0][0]

    if f != None:
        f = f.split('N')
        newnum = int(f[1]) + 1
        
    else:
        newnum = 1

    strnum = f'{datefmt}N{newnum:03}'



    RESERVEDPATIENTNUMS.append(strnum)

    return strnum #new value to give



def addnewpatient(data):

    print("submitted")
    conn = dbhandle(True)

    patientno = check_patientnum(data["patientno"])
    
    name = data['primary']['basicInfo']['patientname']
    contactnum = data['primary']['basicInfo']['phoneno']

    date =  get_date()

# del(data["patientno"])
    data = json.dumps(data)

    conn.execute(f"INSERT INTO PATIENTS VALUES('{patientno}','{name}','{contactnum}','{date}','{data}')")

    f = conn.execute(f"SELECT * FROM PATIENTS WHERE PATIENTNO = '{patientno}'")
    f = json.loads([i for i in f][0][4]) 

    print(f)

    if json.dumps(f) == data:

        print("Database update check successfull.. confirming addition")

        conn.commit()
        conn.close()


        if patientno in RESERVEDPATIENTNUMS:

            RESERVEDPATIENTNUMS.remove(patientno)

        return patientno

    else:

        print("data Mismatch.Not updating ")    
        conn.close()
        return -1



def get_date():
    return datetime.datetime.today().date().strftime("%d-%m-%y")


def api_handler(endpoint,request):
    list_of_endpoints = ['registration','details','inventory','autofill','revisit','miscdata','attachments','cost','mmrp','database','v2']
    print(endpoint)

    print(endpoint)
    if endpoint == 'v2':
        api_handler = APIHandler(request)
        return api_handler.HandleRequest()

    
    if endpoint not in list_of_endpoints:   #check for valid endpoint
        return jsonify({'error':'invalid endpoint'})






    if endpoint == 'database':
        req = request.get_json()
        if req['request'] == 'meds' :
            if req['type'] == 'list':
                databaseObject = utils.database_handler.meds_database_handler(request)
                return jsonify({'resp':databaseObject.get_meds_list()})
            elif req['type'] == 'edit':
                return jsonify({'resp':utils.database_handler.meds_database_handler(request).edit_meds()})
            elif req['type'] == 'count':
                return jsonify({'resp':utils.database_handler.meds_database_handler(request).get_record_count()})
            elif req['type'] == 'add':
                return jsonify({'resp':utils.database_handler.meds_database_handler(request).add_meds()})
            elif req['type'] == 'delete':
                return jsonify({'resp':utils.database_handler.meds_database_handler(request).delete_meds()})

    if endpoint == 'registration': # for new patients

        if request.method != 'POST':
            return jsonify({'error':'invalid method'})

        alldata = request.get_json()
        print("data :",alldata)
        stat = addnewpatient(alldata)
        if stat != -1:
            return jsonify({'status':'success','message':f'record added successfully for Patient Number : {stat}'})
        else:
            return jsonify({'status':'failed'})

    if endpoint == 'details':

        req = request.get_json()

        if 'request' not in req.keys():
            return jsonify({'status':'failed','error':'invalid request format'})

        if req['request'] == 'list':
            conn = dbhandle(True)
            f = conn.execute('SELECT * FROM PATIENTS')
            f = [i for i in f]

            for i in range(len(f)):
                f[i] = list(f[i])
                f[i][4] = json.loads(f[i][4])
                if(f[i][4].get('nextVisitDate') == None):
                    f[i].insert(4,'00-00-00')
                else:
                    #set date to dd-mm-yy format from yyyy-mm-dd
                    nextdate = f[i][4]['nextVisitDate']
                    nextdate = nextdate.split('-')
                    nextdate = nextdate[2]+'-'+nextdate[1]+'-'+nextdate[0][2::]
                    f[i].insert(4,nextdate)

            return jsonify({'data':f})
        
        if req['request'] == 'search':
            qry = req['qry']
            sqlqry = f''' SELECT * FROM PATIENTS WHERE 
                        PATIENTNO LIKE '%{qry}%' OR
                        NAME LIKE '%{qry}%' OR
                        CONTACT LIKE '%{qry}%' OR
                        DATE LIKE '%{qry}%' '''


            print(sqlqry)

            conn = dbhandle(True)
            f = conn.execute(sqlqry)
            f = [i for i in f]
            print(f)
            return jsonify({'data':f})

        if req['request'] == 'refill':
            conn = dbhandle(True)
            f = conn.execute(f"SELECT * FROM PATIENTS WHERE PATIENTNO = '{req['qry']}' ")
            f = [i for i in f][0]
            return jsonify({'data':f})

        return jsonify({'status':'failed','error':'invalid request to endpoint'})

        

    if endpoint == 'inventory':
        req = request.get_json()

    
        if req['request'] == 'reverse': # get details of inventory items
            column = askers[req['column']]
            serial = req['serial']
            conn = dbhandle()
            qry = ""
            if req['column'] == 'meds':
                if type(serial) == int:
                    qry = f"SELECT NAME || ' ' || POTENCY FROM {column['table']} WHERE SERIAL = {serial} "
                elif len(serial) > 1:
                    data = []
                    for i in serial:
                        qry = f"SELECT NAME || ' ' || POTENCY FROM {column['table']} WHERE SERIAL = {i} "
                        f = conn.execute(qry)
                        f = [i for i in f][0][0]
                        data.append(f)
                    return jsonify({'data':data,'serial':serial})

            else:
                if req['column'] == 'container':
                    qry = f"SELECT QTY || ' ' || UNIT FROM {column['table']} WHERE SERIAL = {serial} "
                else:
                    qry = f"SELECT  {column['display']} FROM {column['table']} WHERE SERIAL = {serial} "
            f = conn.execute(qry)
            f = [i for i in f][0][0]
            return jsonify({'data':f,'serial':serial})

        return jsonify({'status':'failed','error':'invalid request to endpoint'})


    if endpoint == 'revisit': # get data of each patient for revisit
        req = request.get_json()

        if 'data' not in req.keys():
            return jsonify({'status':'failed','error':'invalid request format'})
        
        complaint = req['data']['complaint']
        history = req['data']['complaintHistory']
        patientno = req['data']['patientno']
        prescription = req['data']['prescription']
        repertory = req['data']['repertoryData']
        nextvisit = req['data']['nextVisit']
        totalcost = req['data']['totalcost']

        conn = dbhandle(True)

        f = conn.execute(f"SELECT DATA FROM PATIENTS WHERE PATIENTNO = '{patientno}'")
        f = [i for i in f][0][0]
        if len(f)>0:
            f = json.loads(f)
            date = get_date()
            if date in f['complaints'].keys():
                date = date+'-'+str(len(f['complaints'].keys()))
            f['complaints'][date] = {}
            f['complaints'][date]['complaintinput'] = complaint
            f['complaints'][date]['historyinput'] = history
            f['complaints'][date]['prescriptions']  = prescription
            f['complaints'][date]['totalcost'] = totalcost
            f['optional']['repertoryinput'] = repertory
            f['nextVisitDate'] = nextvisit
            print(f['complaints'][date])

            new_data = json.dumps(f)

            sql = f'''UPDATE PATIENTS SET DATA = '{new_data}' 
                        WHERE PATIENTNO = "{patientno}"  '''

            conn.execute(sql)


            f = conn.execute(f"SELECT DATA FROM PATIENTS WHERE PATIENTNO = '{patientno}'")
            f = [i for i in f][0][0]
            if new_data == f:
                
                conn.execute(f"UPDATE PATIENTS SET DATE = '{get_date()}' WHERE PATIENTNO = '{patientno}'  ")
                conn.commit()
                
                return jsonify({'status':'success','message':'records added successfully'})

            
            else:
                return jsonify({'status':'failed','error':'server error data mismatch'})

        return jsonify({'test':'wat'})

    if endpoint == 'miscdata':          # updates unimportant patient data
        reusable = request.get_json()   
        patientno = reusable['patientno']
        conn = dbhandle(True)
        f = conn.execute(f"SELECT DATA FROM PATIENTS WHERE PATIENTNO = '{patientno}'")
        f = [i for i in f][0][0]
        f = json.loads(f)

        if(f.get('nextVisitDate') == None):
            f['nextVisitDate'] = '00-00-00'

        for i in f.keys():
            if i in reusable.keys() and i != 'patientno':
                f[i] = reusable[i]

            else:
                reusable[i] = f[i]
            

        print(f)

        conn.execute(f"UPDATE PATIENTS SET DATA = '{json.dumps(f)}' WHERE PATIENTNO = '{patientno}'")
        

        f = conn.execute(f"SELECT DATA FROM PATIENTS WHERE PATIENTNO = '{patientno}'")
        f = [i for i in f][0][0]
        f = json.loads(f)
        if reusable == f:
            
            #conn.execute(f"UPDATE PATIENTS SET DATE = '{get_date()}' WHERE PATIENTNO = '{patientno}'  ")
            conn.execute(f"UPDATE PATIENTS SET CONTACT = '{f['primary']['basicInfo']['phoneno']}' WHERE PATIENTNO = '{patientno}'")
            conn.execute(f"UPDATE PATIENTS SET NAME = '{f['primary']['basicInfo']['patientname']}' WHERE PATIENTNO = '{patientno}'")


            conn.commit()

            
            return jsonify({'status':'success','message':'records added successfully'})

        
        else:
            return jsonify({'status':'failed','error':'server error data mismatch'})

        #return jsonify({'status':'failed'})

    if endpoint == 'attachments':
        if request.method == 'POST':
            if 'PID' not in request.form.keys():
                return  jsonify({'status':'error','message':'malformed request params'})

            patientnum = request.form['PID']
            f = request.files.getlist('attachfiles')
            print(f,len(f))
            for i in f:
                    fname = secure_filename(i.filename)

                    if not os.path.isdir(os.path.join(app.config['UPLOAD_FOLDER'],patientnum)):
                        os.mkdir(os.path.join(app.config['UPLOAD_FOLDER'],patientnum))

                    i.save(os.path.join(app.config['UPLOAD_FOLDER'],patientnum,fname))

            return(jsonify({'status':'success','path':patientnum}))



        if request.method == 'GET':
            args = request.args.to_dict()

            if 'pid' in args.keys():
                patientnum = args['pid']
            else:
                return jsonify({'status':'error','message':'invalid request params'})

            file_path = safe_join(app.config['UPLOAD_FOLDER'],patientnum)
            print(file_path) 

            if file_path is None:
                return jsonify({'status':'error','message':'malformed request params'})

            else:
                try:
                    contents = os.listdir(file_path)
                except FileNotFoundError:
                    return jsonify({'status':'error','message':'no files'})

                if 'files' in args.keys():
                    fname = args['files']
                    if fname in contents:
                        return send_from_directory(file_path, fname)

            return jsonify({'status':'success','contents':contents})

    if endpoint == 'autofill':
        if request.method != "POST":
            return 'sus actions detected'
            
        nowtype = request.get_json()
        print("data :",nowtype)
        conn = dbhandle()
        try:
            column = askers[nowtype['asker']]
        except KeyError:
            return jsonify({'error':'invalid asker'})

        clean = nowtype['query'].strip()
        qry = f"SELECT SERIAL,{column['display']} FROM {column['table']} WHERE {column['searchby']} LIKE '%{clean}%'"

        out = conn.execute(qry)


        matches = [i for i in out]
        print(matches)

        return jsonify({"data":matches})

            
    if endpoint == 'cost':

        conn = dbhandle()
        if request.method == 'POST':
            serials = request.get_json()  # {'container':[],'medium':[],'meds':[]}
            allcost = 0
            allrates = {}
            print(serials)

            containersize = serials['container'][0]
            
            qry1 = f'SELECT QTY,RATE FROM SIZE WHERE SERIAL = {containersize}'
            try:
                out = conn.execute(qry1)
            except  sqlite3.OperationalError:
                return jsonify({'status':'error','message':'too fast'})

            containerinfo = [o for o in out][0]
            allrates['container'] = containerinfo[1]
            allcost += containerinfo[1]
            print('Container cost :',containerinfo[1])
            unitrate = 0
            if serials['medium'][0] != None:
                medium = serials['medium'][0]
                
                qry2 = f'SELECT RATE FROM MEDIUM WHERE SERIAL = {medium}'
                print(qry2)
                
                try:
                    out = conn.execute(qry2)
                except sqlite3.OperationalError:
                    return jsonify({'status':'error','message':'too fast'})
                
                mediumrate = [o for o in out][0][0]
                allcost += mediumrate
                print('Medium Cost :',mediumrate)
                allrates['medium'] = mediumrate

                if medium == 4:
                    unitrate = containerinfo[0]/len(serials['meds'])
                if medium == 5: #for patents
                    unitrate = 1
                else:
                    unitrate = containerinfo[0]/5
                

            medrates = []

            for i in serials['meds']:
                qry = f"SELECT RATE,QTY,NAME,STOCK FROM {askers['meds']['table']} WHERE SERIAL = {i}"
                out = conn.execute(qry)
                out = [n for n in out][0]
         
                prim = (out[0]/(out[1]*out[3]))*unitrate


                if medium == 5:
                    prim = out[0] # This is for patents with fixed rate

                cost = 1
                cost += prim
                if cost<10:
                    cost = round(prim)*5
                print(f'MED NAME : {out[2]},RATE/{out[1]}:{out[0]/out[1]},UNIT RATE:{unitrate},FINAL COST:{cost}')
                medrates.append(cost)
                allcost += cost
                del(prim,cost)

            allcost = round((math.ceil(allcost)+5)/10)*10 #adding five before round to always round up

            allrates['meds'] = medrates
            allrates['sum'] = allcost
            print(allrates)

            return jsonify({'status':'success','data':allrates})
        else:   
            return jsonify({'status':'error','message':'invalid'})

    if endpoint == 'mmrp':

        search = request.get_json()
        conn = dbhandle()

        if search['method'] == 'autofill':
            qrystr = search['query']
            if search['asker'] == 'repertory':

                searchby = 'INDICATION'
                sql=f'SELECT SERIAL,NAME|| " " ||POTENCY,INDICATION FROM MEDS WHERE '

                qrylist = qrystr.split()
                if(len(qrylist)) > 0:
                    for i in range(len(qrylist)):
                        repeat = f'{searchby} LIKE "%{qrylist[i]}%" '
                        if i != len(qrylist)-1:
                            sql += repeat + 'AND '
                        else:
                            sql += repeat

            else:
                searchby = 'NAME'
                sql=f'SELECT SERIAL,NAME|| " " ||POTENCY,INDICATION FROM MEDS WHERE {searchby} LIKE "%{qrystr}%"'

            out = conn.execute(sql)
            out = [i for i in out]
            conn.close()
            return jsonify({'data':out})
        
        elif search['method'] == 'modify':
            serial = search['serial']
            newval = search['value']

            qry = f"UPDATE MEDS SET INDICATION = '{newval}' WHERE SERIAL = {serial}"
            f = conn.execute(qry)
            print(f)

            checkqry = f'SELECT INDICATION FROM MEDS WHERE SERIAL = {serial}'
            g = conn.execute(checkqry)
            g = [i for i in g][0][0]
            if g == newval:
                conn.commit()
            else:
                print('Value Not Match')
                return jsonify({'error':'Value Not Match','type':'server error'})

            return jsonify({'message':'success'})
            #conn.commit()

        
        else:
            return jsonify({'error':'invalid method','type':'Client error'})




    return jsonify({'status':'failed','error':'you broke it!'})



    

if not os.path.isdir('attachments/'):
    os.mkdir('attachments/')

# an object of WSGI application
app = Flask(__name__)   # Flask constructor
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config['UPLOAD_FOLDER'] = 'attachments/'
# A decorator used to tell the application
# which URL is associated function


        
@app.before_request  
def active_users():
    global LAST_REQUEST_TIME
    if request.path != '/status':
        LAST_REQUEST_TIME = datetime.datetime.now().strftime("%d/%m/%y %H:%M:%S")
    return 


@app.route('/')
def hello():
    return render_template("patients.html")


@app.route('/new',methods=["GET"])
def new():
        date =  get_date()
        return render_template("new.html",patientnum =  patientnum(),date = date)





@app.route('/patients',methods=["GET","POST"])
def patients():
    return render_template('patients.html')

 

@app.route('/details')
def patientdetails():
        return render_template('details.html',date=get_date())


@app.route('/followup',methods=['GET'])
def handlefollowup():
    return render_template('followup.html')


@app.route('/table',methods=["GET"])
def table():
        return render_template("table.html")



@app.route('/mmrp',methods=['GET'])
def repertory():
        return render_template('repertory.html')

@app.route('/api/<endpoint>',methods = ['GET','POST'])
def api(endpoint):
    return api_handler(endpoint,request)

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route('/database')
def databasemod():
    return render_template('database.html')

@app.route('/status')
def userstatus():
    return jsonify({'last':LAST_REQUEST_TIME})






if __name__=='__main__':
    parser = argparse.ArgumentParser('Set Port and Host config')
    parser.add_argument('--port',type=int,dest='port',default=8989)
    parser.add_argument('--host',type=str,dest='host',default='0.0.0.0')
    args = parser.parse_args()
    port = args.port
    host = args.host
    app.run(port=port,host=host)
