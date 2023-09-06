import '../style/New.css';

import React, { useState } from 'react';

export default function New() {
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
            appetite: "",
            thirst: "",
            stool: "",
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
        regoinalExamination: "",
    }
    const repertory = {
        repertorisation: "",
    }
    const miscellaneous = {
        miscellaneous: "",
    }


    const [details, setDetails] = useState(basicDetails);
    const [complaints, setComplaints] = useState(presentingComplaints);
    const [history, setHistory] = useState(patientHistory);
    const [examination, setExamination] = useState(regoinalExamination);
    const [repertorisation, setRepertorisation] = useState(repertory);
    const [misc, setMisc] = useState(miscellaneous);


    const handleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case "name":
            case "age":
            case "phone":
            case "address":
            case "gender":
                setDetails({ ...details, name: value });
                break;
            case "complaints":
                setComplaints({ ...complaints, presentcomplaint: value });
            
            case "history":
            case "familyHistory":
            case "pastHistory":
                    setHistory({ ...history, history: value });
                    break;

            case "generalities":
                setHistory({ ...history, generalities: { ...history.generalities, [name]: value } });
                break;
            case "responseToTreatment":
                setHistory({ ...history, responseToTreatment: { ...history.responseToTreatment, [name]: value } });
                break;
            case "regoinalExamination":
                setExamination({ ...examination, regoinalExamination: value });
                break;
            case "repertorisation":
                setRepertorisation({ ...repertorisation, repertorisation: value });
                break;
            case "miscellaneous":
                setMisc({ ...misc, miscellaneous: value });
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
                <input type="text" name="name" value={details.name} onChange={handleChange} />
            </div>
            <div className="inputs">
                <label>Age</label>
                <input type="text" name="age" value={details.age} onChange={handleChange} />
            </div>
            <div className="inputs">
                <label>Phone</label>
                <input type="text" name="phone" value={details.phone} onChange={handleChange} />
            </div>
            <div className="inputs">
                <label>Address</label>
                <input type="text" name="address" value={details.address} onChange={handleChange} />
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
                <textarea type="text" name="complaints" value={complaints.presentcomplaint} onChange={handleChange} />
            </div>
        </div>
    
    const patientHistoryForm =
        <div className="patientHistory">
            <div className='minititle'> Patient History</div>
            <div className="biginputs">
                <textarea type="text" name="history" value={history.history} onChange={handleChange} />
            </div>
            <div className='miniinputs'>
                <div className="inputs">
                    <label>Family History</label>
                    <input type="text" name="familyHistory" value={history.familyHistory} onChange={handleChange} />
                </div>
                <div className="inputs">
                    <label>Past History</label>
                    <input type="text" name="pastHistory" value={history.pastHistory} onChange={handleChange} />
                </div>
            </div>
                <div className='minititle'>Generalities</div>
                    <div className="miniinputs">
                        {Object.keys(patientHistory.generalities).map((item, index) => {
                            return (
                                <div className="inputs">
                                    <label >{item}</label>
                                    <input type="text" name="generalities" value={patientHistory.generalities.item} onChange={handleChange} />
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
                                        <input type="text" name="responseToTreatment" value={patientHistory.responseToTreatment.item} onChange={handleChange} />
                                    </div>
                                )
                            })}
                    
                
            </div>
        </div>
    
    return (
        <div className="App">
            <div className="title">New Patient</div>
            <div className="New">
                <div className='bigbox'>
                {basicDetailsForm}
                {presentingComplaintsForm}
                </div>
                {patientHistoryForm}
            </div>
        </div>
        )
        
}
