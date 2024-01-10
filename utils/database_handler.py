
import os
import sqlite3
import datetime
import json
from werkzeug.utils import secure_filename
from werkzeug.security import safe_join

from flask import jsonify
def dbhandle(dbname=False,version = 1.0):
    basePath = "databases/v{}".format(version)
    if dbname != False:
        return sqlite3.connect(f'{basePath}/protecc/patients.db')
    conn = sqlite3.connect("databases/meds.db")
    return conn


class meds_database_handler:
    def __init__(self,request):
        self.request = request
        self.db = dbhandle()

    def get_meds_list(self):
        contents = self.db.execute("SELECT * FROM MEDS")
        contents = [i for i in contents]
        jsonArray = {}
        for i in contents:
            jsonArray[i[0]] = i
        return jsonArray
    
    def get_record_count(self):
        contents = self.db.execute("Select MAX(SERIAL) FROM MEDS")
        contents = [i for i in contents][0]
        return contents
    
    def add_meds(self):
        content = self.request.get_json()
        print(content["data"])
        data  = content['data']
        
        datas = [i for i in data.values()]
        for data in datas:
            data = [i.strip() for i in data]
            print(data)
            qrystr = f"{int(data[0])},'{data[1]}','{data[2]}',{int(data[3])},'{data[4]}',{int(data[5])},{int(data[6])},'{data[7]}'"
            self.db.execute(f"INSERT INTO MEDS VALUES ({qrystr})")
            cont = self.db.execute(f"Select * FROM MEDS WHERE SERIAL = {data[0]}")
            cont = [i for i in cont][0]
            print(cont)
            if list(cont) == data:
                print("Added")
        self.db.commit()
        self.db.close()
        return "Added"
    
    def edit_meds(self):
        content = self.request.get_json()
        data  = content['data']
        print(data)
        qrystr = f"NAME = '{data[1]}',POTENCY = '{data[2]}',QTY = {int(data[3])},UNIT = '{data[4]}',RATE = {int(data[5])},STOCK = {int(data[6])},INDICATION = '{data[7]}'"
        self.db.execute(f"UPDATE MEDS SET {qrystr} WHERE SERIAL = {data[0]}")
        cont = self.db.execute(f"Select * FROM MEDS WHERE SERIAL = {data[0]}")
        cont = list([i for i in cont][0])
        print(cont)
        if list(cont) == data:
            print("Modified Data Successfully")

        self.db.commit()
        self.db.close()

        return "Modified Data Successfully"
    
    def delete_meds(self):
        content = self.request.get_json()
        data  = content['data']
        print(data)
        self.db.execute(f"DELETE FROM MEDS WHERE SERIAL = {data[0]}")
        cont = self.db.execute(f"Select * FROM MEDS WHERE SERIAL = {data[0]}")
        cont = [i for i in cont]
        print(cont)
        if cont == []:
            print("Deleted Data Successfully")
        self.db.commit()
        self.db.close()

        
        return "Deleted Data Successfully"
    
class patient_db_handle:
    def __init__(self,version,request):
        self.db = dbhandle(True,version)

    def get_patient_list(self):
        contents = self.db.execute("SELECT * FROM PATIENTS")
        contents = [i for i in contents]   


        for i in range(len(contents)):
            contents[i] = list(contents[i])
            contents[i][4] = json.loads(contents[i][4])
            if(contents[i][4].get('nextVisitDate') == None or len(contents[i][4]['nextVisitDate']) < 1):
                contents[i][4]['nextVisitDate'] = 'Not Scheduled'
            else:
                #set date to dd-mm-yy format from yyyy-mm-dd
                nextdate = contents[i][4]['nextVisitDate']
                nextdate = nextdate.split('-')
                nextdate = nextdate[2]+'-'+nextdate[1]+'-'+nextdate[0][2::]
                contents[i].insert(4,nextdate)               
     
        
        return jsonify({'data':contents})


    def search_patient(self):
        content = self.request.get_json()
        search = content['qry']
        f = self.db.execute(f"SELECT * FROM PATIENTS WHERE PATIENTNO LIKE '{search}' 
                            OR NAME LIKE '{search}'
                            OR CONTACT LIKE '{search}'
                            OR DATE LIKE '{search}' ")
        f = [i for i in f][0]
        return jsonify({'data':f})


    def get_patient_details(self):
        content = self.request.get_json()
        patientnum = content['qry']
        f = self.db.execute(f"SELECT * FROM PATIENTS WHERE PATIENTNO = '{patientnum}'")
        f = [i for i in f][0]
        return json.dumps({'data':f,'status':'success'})


    def check_patientnum(self,patientnum):
        f = self.db.execute("select MAX(PATIENTNO) FROM PATIENTS")
        f = [i for i in f][0][0]
        datefmt = datetime.datetime.today().date().strftime("%y%m")

        if f == patientnum:
            f = f.split('N')
            newnum = int(f[1]) + 1

            strnum = f'{datefmt}N{newnum:03}'
            return strnum
        
        else:
            return patientnum

    def patient_followup(self):
        req = self.request.get_json()

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
            date = datetime.datetime.today().date().strftime("%d-%m-%y")
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
                
                conn.execute(f"UPDATE PATIENTS SET DATE = '{date}' WHERE PATIENTNO = '{patientno}'  ")
                conn.commit()
                
                return jsonify({'status':'success','message':'records added successfully'})

            
            else:
                return jsonify({'status':'failed','error':'server error data mismatch'})

        else:
            return jsonify({'status':'failed','error':'invalid patient number'})
        
    def update_patient_details(self):
        req = self.request.get_json()

        if 'data' not in req.keys():
            return jsonify({'status':'failed','error':'invalid request format'})
        
        patientno = req['patientno']
        conn = dbhandle(True)

        f = conn.execute(f"SELECT DATA FROM PATIENTS WHERE PATIENTNO = '{patientno}'")
        f = [i for i in f][0][0]
        if len(f)>0:

            if(f.get('nextVisitDate') == None):
                f['nextVisitDate'] = '00-00-00'

            for i in f.keys():
                if i in req.keys() and i != 'patientno':
                    f[i] = req[i]

                else:
                    req[i] = f[i]
            
            conn.execute(f"UPDATE PATIENTS SET DATA = '{json.dumps(f)}' WHERE PATIENTNO = '{patientno}'  ")

            f = conn.execute(f"SELECT DATA FROM PATIENTS WHERE PATIENTNO = '{patientno}'")
            f = [i for i in f][0][0]
            if req == f:
                conn.commit()
                return jsonify({'status':'success','message':'records added successfully'})
            else:
                return jsonify({'status':'failed','error':'server error data mismatch'})
        else:
            return jsonify({'status':'failed','error':'invalid patient number'})


    def get_patientnum(self):
        conn = self.db
        datefmt = datetime.datetime.today().date().strftime("%y%m")

        f = conn.execute("select MAX(PATIENTNO) FROM PATIENTS")
        f = [i for i in f][0][0]

        if f != None:
            f = f.split('N')
            newnum = int(f[1]) + 1
            
        else:
            newnum = 1

        strnum = f'{datefmt}N{newnum:03}'

        return strnum #new value to give

    def add_new_patient(self, data):
        new_num = self.get_patientnum()
        print(new_num)
        name = data['primary']['basicInfo']['patientname']
        contact = data['primary']['basicInfo']['phoneno']
        date = datetime.datetime.today().date().strftime("%d-%m-%y")
        self.db.execute(f"INSERT INTO PATIENTS VALUES ('{new_num}','{name}','{contact}','{date}','{json.dumps(data)}')")
        f = self.db.execute(f"SELECT * FROM PATIENTS WHERE PATIENTNO = '{new_num}'")
        f = json.loads([i for i in f][0][4])
        print(f)
        if(f == data):
            print("Added")
            self.db.commit()      
            return jsonify({'status':'success','patientnum':new_num})
        else:
            return jsonify({'status':'failed, Mismatched Data','patientnum':new_num})
