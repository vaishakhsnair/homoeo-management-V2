import json
from flask import jsonify
from utils import database_handler as DatabaseHandler
class APIHandler:
    def __init__(self,request) -> None:
        self.request = request
        
    def HandleRequest(self):
        if(self.request.method == "POST"):
            path  = self.request.path.split("/")[-1]

            match path:
                case "newpatient":
                    data =  json.loads(self.request.data.decode("utf-8"))
                    return DatabaseHandler.patient_db_handle(version=2.0,request=self.request).add_new_patient(data)
                case "getpatientlist":
                    return DatabaseHandler.patient_db_handle(version=2.0,request=self.request).get_patient_list()
                case 'getpatientdetails':
                    data =  json.loads(self.request.data.decode("utf-8"))
                    print("nedat :",data)
                    return DatabaseHandler.patient_db_handle(version=2.0,request=self.request).get_patient_details(data['patientno'])
        elif(self.request.method == "GET"):
            data = self.request.path.split("/")[-1]
            return jsonify({"data":"Not Implemented","status":501})
                
        else:
            print("Invalid Request Method")
    

    
