import '../style/New.css';

import React, { useState } from 'react';
import Navbar from '../HomeComponents/Navbar';
import MedsTable from '../components/MedsTable';
import axios from 'axios';

export default function New() {

    const rowData = [[1,"","",[],"","",1]];

    const basicDetails = { 
        name: "",
        age: "",
        phone: "",
        address: "",
        gender: ""
    }
    const presentingComplaints = {
        presentcomplaint: "",
    }
    const patientHistory = {
        history: "",
        familyHistory: "",
        pastHistory: "",
        generalities: {
            Appetite: "",
            Thirst: "",
            Stool: "",
            desire: "",
            aversion: "",
            intolerance: "",
            urine: "",
            sleep: "",
            dreams: "",
            other: ""
        },
        responseToTreatment: {
            fanning: "",
            openAir: "",
            postural: "",
            pressure: "",
            bathing: "",
            Elimination: "",
            Drinks: "",
            PhysicalConstitution: "",
            clothing: "",
            seasonal: "",
            thermal: "",
            time: "",
            motion: "",
            menses: "",
            food: "",
            mental: "",
            other: ""
        }
    }
    const regoinalExamination = {
        exam: "",
    }
    const repertory = {
        repData: "",
    }
    const miscinfo = {
        miscData: "",
    }


    const [details, setDetails] = useState(basicDetails);
    const [complaints, setComplaints] = useState(presentingComplaints);
    const [history, setHistory] = useState(patientHistory);
    const [examination, setExamination] = useState(regoinalExamination);
    const [repertorisation, setRepertorisation] = useState(repertory );
    const [misc, setMisc] = useState(miscinfo);
    const [ data, setdata ] = useState(rowData);
    
    function sendAllData() {
        const dataToSend = {
            basicDetails: details,
            presentingComplaints: complaints,
            patientHistory: history,
            regionalExamination: examination,
            repertory: repertorisation,
            miscellaneous: misc,
            meds: data
        }
        console.log(dataToSend);
        if(details.name.length === 0){
            alert('Name is required')
            return
        }
        if(details.age.length === 0){
            alert('Age is required')
            return
        }
        if(details.phone.length === 0){
            alert('Phone is required')
            return
        }
        
        axios.post('/api/v2/newpatient', dataToSend)
            .then(res => {
                console.log(res.data)
                if(res.data.status === 'success'){
                    alert('Patient Added Successfully')
                    window.location.href = '/'
                }
            }
                );
        
        

    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value)
        switch (name) {
            case "name":
            case "age":
            case "phone":
            case "address":
            case "gender":
                setDetails({ ...details, [name]: value });
                break;
            case "complaints":
                setComplaints({ ...complaints, presentcomplaint: value });
                break;
            case "history":
                setHistory({ ...history, history: value });
                break;
            case "familyHistory":
                setHistory({ ...history, familyHistory: value });
                break;
            case "pastHistory":
                setHistory({ ...history, pastHistory: value });
                break;

            case "generalities":
                setHistory({ ...history, generalities: { ...history.generalities, [name]: value } });
                break;
            case "responseToTreatment":
                setHistory({ ...history, responseToTreatment: { ...history.responseToTreatment, [name]: value } });
                break;
            case "regoinalExamination":
                setExamination({ ...examination, exam: value });
                console.log(examination);
                break;
            case "repertorisation":
                setRepertorisation({ ...repertorisation, repData: value });
                console.log(repertorisation);
                break;
            case "miscellaneous":
                setMisc({ ...misc, miscData : value });
                console.log(misc);
                break;
            default:
                break;
        }
            
    }


    //create form for basic details
    const basicDetailsForm = 
        <div className="basicDetails">
            <div className='minititle'> Patient Details</div>
            <div className="inputs">
                <label>Name</label>
                <input className='inputbox' type="text" name="name" value={details.name} onChange={handleChange} />
            </div>
            <div className="inputs">
                <label>Age</label>
                <input className='inputbox' type="text" name="age" value={details.age} onChange={handleChange} />
            </div>
            <div className="inputs">
                <label>Phone</label>
                <input className='inputbox' type="text" name="phone" value={details.phone} onChange={handleChange} />
            </div>
            <div className="inputs">
                <label>Address</label>
                <input className='inputbox' type="text" name="address" value={details.address} onChange={handleChange} />
            </div>
            <div className='inputs'>
                <label>Gender</label>
                <select name="gender" value={details.gender} onChange={handleChange}>
                        <option  value="Male">Male</option>
                        <option  value="Female">Female</option>
                        <option  value="Other">Other</option>
                </select>  
            </div>
        </div>
    
    const presentingComplaintsForm =
        <div className="presentingComplaints">
            <div className='minititle'> Presenting Complaints</div>
            <div className="biginputs">
                <textarea type="text" className='bigtextarea' name="complaints" value={complaints.presentcomplaint} onChange={handleChange} />
            </div>
        </div>
    
    const patientHistoryForm =
        <div className="patientHistory">
            <div className='minititle'> Patient History</div>
            <div className="biginputs">
                <textarea type="text" className='bigtextarea' name="history" value={history.history} onChange={handleChange} />
            </div>
            <div className='miniinputs'>
                <div className="inputs">
                    <label>Family History</label>
                    <input className='inputbox' type="text" name="familyHistory" value={history.familyHistory} onChange={handleChange} />
                </div>
                <div className="inputs">
                    <label>Past History</label>
                    <input className='inputbox' type="text" name="pastHistory" value={history.pastHistory} onChange={handleChange} />
                </div>
            </div>
                <div className='minititle'>Generalities</div>
                    <div className="miniinputs">
                        {Object.keys(patientHistory.generalities).map((item, index) => {
                            return (
                                <div className="inputs">
                                    <label >{item}</label>
                                    <input className='inputbox' type="text" name="generalities" value={patientHistory.generalities.item} onChange={handleChange} />
                                </div>
                            )
                        })}
                    </div>
                        <div className='minititle'>Response to Treatment</div>
                        <div className="miniinputs">
                            {Object.keys(patientHistory.responseToTreatment).map((item, index) => {
                                return (
                                    <div className="inputs">
                                        <label >{item}</label>
                                        <input className='inputbox' type="text" name="responseToTreatment" value={patientHistory.responseToTreatment.item} onChange={handleChange} />
                                    </div>
                                )
                            })}
                    
                
            </div>
        </div>
    
    const regionalExaminationForm =
        <div className="regionalExamination">
            <div className='minititle'> Regional Examination</div>
            <div className="biginputs">
                <textarea type="text" className='bigtextarea' name="regoinalExamination" value={regoinalExamination.Examination} onChange={handleChange} />
            </div>
        </div>
    const repertoryForm =
        <div className="repertory">
            <div className='minititle'> Repertory</div>
            <div className="biginputs">
                <textarea type="text" className='bigtextarea' name="repertorisation" value={repertory.repertorisation} onChange={handleChange} />
            </div>
        </div>
    const miscellaneousForm =
        <div className="miscellaneous">
            <div className='minititle'>Miscellaneous</div>
            <div className="biginputs">
                <textarea type="text" className='bigtextarea' name="miscellaneous" value={miscinfo.miscellaneous} onChange={handleChange} />
            </div>
        </div>

    return (
        <div className="App">
          
            <div className="New">
            <Navbar />
            <div className="title">New Patient</div>
                <div className='bigbox'>
                {basicDetailsForm}
                {presentingComplaintsForm}
                </div>
                {patientHistoryForm}
                {regionalExaminationForm}
                {repertoryForm}
                {miscellaneousForm}
                <MedsTable data={data} setdata={setdata} />
                <button className='btn btn-primary' onClick={sendAllData}>Submit</button>
            </div>
        </div>
        )
        
}
