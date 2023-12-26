import { isContentEditable } from '@testing-library/user-event/dist/utils';
import React, { useState } from 'react';
import axios from 'axios';

export default function MedsTable({data,setdata}) {


    const tableHeaders = ["Serial","Size","Medium","Meds","Dosage","cost","Count","Duplicate","Delete","Add"];
    const tableFrame = 
        <table className="table table-auto table-striped table-bordered border-separate border-spacing-1  w-4/5 self-center m-2 ">
            <thead>
                <tr>
                    {tableHeaders.map((header,index) => {
                        switch (header) {
                            case "Add":
                                return (
                                    <th key={index} className="border border-white rounded  border-spacing-1 ">
                                        <button className="btn btn-primary w-full" onClick={() => {
                                            //add a new row to the table
                                            var newdata = [...data, [data.length + 1, "", "", [], "", "", "", "", ""]];

                                            setdata(newdata);
                                            console.log("Before creation", newdata);
                                        }}>
                                            Add Row
                                        </button>
                                    </th>
                                );
                            default:
                                return <th key={index} className="border border-transparent  w-1/9">{header}</th>;
                        }
                    })}
                </tr>
            </thead>
            <SetAutofill data={data} setdata={setdata} />

        </table>

    

    return (
        <div className='w-11/12 self-center'>
            {tableFrame}
        </div>
    )
}


function getCost({data,setdata,inputData,setInputData,rowindex}) {
    for(var i=0;i<7;i++){
        if(data[rowindex].length == 0){
            return -1
        }
    }

    var reqData = {
        "container": [data[rowindex][1]],
        "medium": [data[rowindex][2]],
        "meds": data[rowindex][3]
    }
    console.log("reqdata",reqData)
    axios.post('/api/cost',reqData)
    .then(res => {
        const newdata = [...data]
        const inputstuff = [...inputData]

        var cost = 0
        // {"data":{"container":6,"medium":4,"meds":[25,40],"sum":80},"status":"success"} response format
        cost = res.data.data.sum * data[rowindex][6]

        console.log("response",res)
        newdata[rowindex][5] = cost
        inputstuff[rowindex][5] = cost
        setInputData(inputstuff)
        setdata(newdata)
    })
}

function SetAutofill({data,setdata}) {
    var inputDataPlaceholder = [["","","",[],"","",1]];
    const [inputData, setInputData] = useState(inputDataPlaceholder);
    var queryList = ["","",""]
    const askers = ["container","medium","meds"]
    var returndata = [
        {
            id:'None',
            value:'Loading'
        }
    ]
    const [currentResponse, setResponse] = useState(returndata)
    const [currentQuery, setquery] = useState(queryList)
    const [selectedOptionId, setSelectedOptionId] = useState(null); //this is for the datalist input
    const [medsList, setMedsList] = useState([[]]);


    //send post request to get autofill data
    function OptionsList(query,asker){
        var responseData;
       if(query === "" || queryList === currentQuery){
              return currentResponse

        }
        const reqData = {
            "asker": asker,
            "query": query
        }
        axios.post('/api/autofill',reqData)
        .then(res => {
            queryList = currentQuery
            responseData = res.data.data
            const newreturn = responseData.map((item) => {
                return {
                    id: item[0],
                    value: item[1] + " " + (item[2]===undefined?"":item[2])
                }
            })
            setResponse(newreturn)
        })
        .catch(err => {
            console.log(err)
        })
      
    }


    return(
        <tbody>
            {inputData.map((row,index) => {
                console.log(data)

                return <tr key={inputData.indexOf(row)} >
                        <td className='border w-1/8 rounded text-center' id='serial' >{inputData.indexOf(row)+1}</td>

                        <td className='border w-1/5 rounded' id='container'>
                              <input className="w-full text-center bg-transparent" type="text" list='containerlist' value={inputData[inputData.indexOf(row)][1]}  onChange={e => {
                                        const inputstuff = [...inputData] 
                                        inputstuff[inputData.indexOf(row)][0] = inputData.indexOf(row)+1
                                        if(e.target.value.startsWith("{") && e.target.value.endsWith("}")){
                                            const value = JSON.parse(e.target.value);
                                            inputstuff[inputData.indexOf(row)][1] = value.text
                                            const newdata = [...data]
                                            newdata[inputData.indexOf(row)][1] = value.id
                                            setdata(newdata)
                                            setSelectedOptionId(null)
                                            getCost({data,setdata,inputData,setInputData,rowindex:inputData.indexOf(row)})


                                        }
                                        else{
                                            inputstuff[inputData.indexOf(row)][1] = e.target.value
                                        }
                                        setInputData(inputstuff)
                                        const newquery = [...currentQuery]
                                        newquery[0] = e.target.value
                                        setquery(newquery)
                                        OptionsList(currentQuery[0],"container")
                                }}/>
                                <datalist id='containerlist' >
                                    {currentResponse.map((item) => {
                                        return <option  value={JSON.stringify({id:item.id,text:item.value})} data={item.id}  >{item.value}</option>
                                    })}
                                </datalist>
                                


                                

                        </td> 

                        <td className='border w-1/5 rounded' id='medium'>
                              <input className="w-full text-center bg-transparent" type="text" list='mediumlist' value={inputData[inputData.indexOf(row)][2]}  onChange={e => {
                                        const inputstuff = [...inputData] 

                                        if(e.target.value.startsWith("{") && e.target.value.endsWith("}")){
                                            const value = JSON.parse(e.target.value);
                                            console.log("selected",value)
                                            inputstuff[inputData.indexOf(row)][2] = value.text
                                            const newdata = [...data]
                                            newdata[inputData.indexOf(row)][2] = value.id
                                            setdata(newdata)
                                            setSelectedOptionId(null)
                                            getCost({data,setdata,inputData,setInputData,rowindex:inputData.indexOf(row)})


                                        }
                                        else{
                                            inputstuff[inputData.indexOf(row)][2] = e.target.value
                                        }
                                        setInputData(inputstuff)
                                        const newquery = [...currentQuery]
                                        newquery[1] = e.target.value
                                        setquery(newquery)
                                        OptionsList(currentQuery[1],"medium")
                                }}/>
                                <datalist id='mediumlist'>
                                    {currentResponse.map((item) => {
                                        return <option value={JSON.stringify({id:item.id,text:item.value})} data={item.id}>{item.value}</option>
                                    })}
                                </datalist>
                            
                        </td> 


                        <td className='border w-1/3 rounded flex-col' id='container'>
                              <input className="w-full text-center bg-transparent border rounded     border-b-white" type="text" list='medslist' value={inputData[inputData.indexOf(row)][3]}  onChange={e => {
                                        const inputstuff = [...inputData]   
                                        
                                        if(e.target.value.startsWith("{") && e.target.value.endsWith("}")){
                                            const value = JSON.parse(e.target.value);
                                            inputstuff[inputData.indexOf(row)][3] = "";
                                            const newmedslist = [...medsList];
                                            newmedslist[inputData.indexOf(row)].push(value.text)
                                            setMedsList(newmedslist);
                                            const newdata = [...data]
                                            newdata[inputData.indexOf(row)][3].push(value.id)
                                            setdata(newdata)
                                            setSelectedOptionId(null)
                                            console.log("newdata",newdata)
                                            getCost({data,setdata,inputData,setInputData,rowindex:inputData.indexOf(row)})

                                        }
                                        else{
                                            inputstuff[inputData.indexOf(row)][3] = e.target.value
                                        }
                                        setInputData(inputstuff)
                                        const newquery = [...currentQuery]
                                        newquery[2] = e.target.value
                                        setquery(newquery)
                                        OptionsList(currentQuery[2],"meds")
                                }}
                                
                                
                                />
                                <datalist id='medslist' >
                                    {currentResponse.map((item) => {
                                        const id = item.id
                                        return <option value={JSON.stringify({id:item.id,text:item.value})} data={item.id} >{item.value}</option>
                                    })}
                                </datalist>
                                <div className='flex flex-row'>
                                    {fillMedsList({medsList,setMedsList,data,setdata,rowindex:inputData.indexOf(row)})}
                                </div>
                                


                                

                        </td> 
      
        
                        <td className='border w-1/5 rounded' id='Dosage'>
                                        <textarea className="w-full h-full text-center bg-transparent" type="text" value={inputData[inputData.indexOf(row)][4]} list='' onChange={e => {
                                        const inputstuff = [...inputData]
                                        inputstuff[inputData.indexOf(row)][4] = e.target.value
                                        setInputData(inputstuff)

                                        const newdata = [...data]
                                        newdata[inputData.indexOf(row)][4] = e.target.value
                                        setdata(newdata)

            
                                            }}/>
                                    </td>

                        <td className='border w-1/5 rounded' id='cost'>
                                        <input className="w-full text-center bg-transparent"   disabled type="text" value={inputData[inputData.indexOf(row)][5]} list='' onClick={e => {
                                            getCost({data,setdata,inputData,setInputData,rowindex:inputData.indexOf(row)})
                                            }}/>
                        </td>

                        <td className='border w-1/5 rounded' id='count'>
                                        <input className="w-full text-center bg-transparent" type="number" value={inputData[inputData.indexOf(row)][6]} list='' onChange={e => {
                                       const inputstuff = [...inputData]
                                       const newdata = [...data]
                                       newdata[inputData.indexOf(row)][6]  = parseInt(e.target.value)
                                       inputstuff[inputData.indexOf(row)][6] = e.target.value
                                       setInputData(inputstuff)
                                       setdata(newdata)
                                       getCost({data,setdata,inputData,setInputData,rowindex:inputData.indexOf(row)})
                                    
                                            }}/>
                        </td>

                        <td className='border w-1/5 rounded'>
                                    <button className="btn btn-primary btn-block self-center" onClick={e => {
                                        //duplicate the row
                                                const newdata = JSON.parse(JSON.stringify(data));
                                                const inputstuff = JSON.parse(JSON.stringify(inputData));
                                                const newmedslist = JSON.parse(JSON.stringify(medsList));
                                                var newmedsrow =  JSON.parse(JSON.stringify(medsList[inputData.indexOf(row)]))
                                                var newrow =JSON.parse(JSON.stringify(newdata[inputData.indexOf(row)]))
                                                var inputnewrow = JSON.parse(JSON.stringify(inputstuff[inputData.indexOf(row)]))
                                                newrow[0] = newdata.length+1
                                                //console.log("newrow",newrow,"inputnewrow",inputnewrow,"data",data,"inputdata",inputData)
                                                newdata.push(newrow)
                                                inputstuff.push(inputnewrow)
                                                newmedslist.push(newmedsrow)
                                                
                                                setdata(newdata)
                                                setInputData(inputstuff)
                                                setMedsList(newmedslist)
                                            }}>Duplicate</button>
                                        </td>
                        <td className='border rounded w-1/5'>
                                            <button className="btn btn-danger w-full" onClick={e => {
                                                //delete the row
                                                const newdata = [...data]
                                                const inputstuff = [...inputData]
                                                newdata.splice(data.indexOf(row),1)
                                                inputstuff.splice(data.indexOf(row),1)
                                                setInputData(inputstuff)

                                                setdata(newdata)
                                            }}>Delete</button>
                        </td>
                </tr>
            })}
        </tbody>
        
    )
}


function fillMedsList({medsList,setMedsList,data,setdata,rowindex}){
    return (
        <div className='w-full flex-col' >
        {medsList[rowindex].map((item,key) => {
            return (
            <div className='flex justify-evenly w-full'>
            <p className='items-start m-2 w-3/4'>{item}</p>  
            <button className=  'm-2 self-center border w-1/4 border-white items-end rounded-md' onClick={
                e => {
                    const newMedsList = [...medsList]
                    newMedsList[rowindex].splice(key,1)
                    setMedsList(newMedsList)
                    var newdata = [...data]
                    newdata[rowindex][3].splice(key,1)
                    setdata(newdata)
                }
            }>Delete</button>
            </div>
            )
            
        })}
        </div>

       )
}