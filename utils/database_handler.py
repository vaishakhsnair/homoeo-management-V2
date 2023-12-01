
import sqlite3
import datetime
import json

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
        
        return jsonify({'data':contents})




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
        name = data['basicDetails']['name']
        contact = data['basicDetails']['phone']
        date = datetime.datetime.today().date().strftime("%d-%m-%y")
        self.db.execute(f"INSERT INTO PATIENTS VALUES ('{new_num}','{name}','{contact}','{date}','{json.dumps(data)}')")
        f = self.db.execute(f"SELECT * FROM PATIENTS WHERE PATIENTNO = '{new_num}'")
        f = json.loads([i for i in f][0][4])
        print(f)
        if(f == data):
            print("Added")
            self.db.commit()      
            return jsonify({'status':'success','patientnum':new_num})

    def get_patient_details(self,patientnum):
        f = self.db.execute(f"SELECT * FROM PATIENTS WHERE PATIENTNO = '{patientnum}'")
        f = [i for i in f][0]
        return json.dumps({'data':f,'status':'success'})