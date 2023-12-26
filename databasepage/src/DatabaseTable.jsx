import './css/dist/table.css'
import React, { useEffect, useState } from 'react';
import Overlay from './Overlay'

export default function DatabaseTable({editButtonClickAction}){


    const [data, setData] = useState({});
    const [originData,setOriginData] = useState({})

    useEffect(() => {
      fetch('/api/database',{method:"POST", headers: {"Content-Type": "application/json"},body:JSON.stringify({'request':'meds','type':'list'})}) // Replace with your API endpoint
        .then(response => response.json())
        .then(data => {
            setData(data.resp)
            setOriginData(data.resp)
        })
        .catch(error => console.log(error));
    }, []);
    console.log(data)
    return(
    <div>
    <MedSearchInputStuff tableData={originData} setTableData={setData}/>

    <div className="tableContainer">
            <table id="medslist" >
                <tr className='head'>
                    <td class="hitem">Serial</td>
                    <td class="hitem">Name</td>
                    <td class="hitem">Potency</td>
                    <td class="hitem">Quantity</td>
                    <td class="hitem">Unit</td>
                    <td class="hitem">Rate</td>
                    <td class="hitem">Stock</td>
                    <td class="hitem" style={{
                    width:'30%',
                    overflowY:'scroll'
                    }}>
                        Indication
                    </td>
                    <td class="hitem">Edit</td>

                </tr>
                {
                    Object.values(data).map((item) => (
                        <tr key={item[0]} id={"key-"+item[0]}>
                            {item.map((subitem) => (                       
                                <td className='titem'>{subitem}</td>
                                ))}
                            <td className='titem' rowdata={item} onClick={editButtonClickAction} id='modmeds'>Edit</td>
                        </tr>

                        )
                    )
                }
            </table>
    </div>
    </div>
    )
}


export function MedSearchInputStuff({tableData,setTableData}){
    return(
      <div className='search-input-batch'>
        <div className='overlay-input-container'>Enter Serial Number :<input type="number" className='overlay-input-fields' name="" id="serialinput" onChange={event => SearchMedsFromInput(event,tableData,setTableData)}/></div>
            <div className='overlay-input-container' >Or</div>
        <div className='overlay-input-container'>Type its Name : <input type="text" className='overlay-input-fields' name="" id="nameInput" onChange={event => SearchMedsFromInput(event,tableData,setTableData)} /></div>
      </div>
    )
  }


function SearchMedsFromInput(event,tableData,setTableData){
    switch(event.currentTarget.id){
        case 'serialinput':

            console.log(event.currentTarget.value)
            var currentSearch = event.currentTarget.value.toString()
            const KeyArray = Object.keys(tableData)
            console.log(KeyArray)
            if(KeyArray.includes(currentSearch)){
                var newObj = {}
                newObj[currentSearch] = tableData[currentSearch]
                setTableData(newObj)
            }
            else{
                setTableData(tableData)
            }
            break
        
        case 'nameInput':
            console.log(event.currentTarget.value)
            var currentSearch = event.currentTarget.value
            var newObj = {}
            Object.keys(tableData).map((item) => {
                if(tableData[item][1].toLowerCase().includes(currentSearch.toLowerCase())){
                    newObj[item] = tableData[item]
                    
                }
            } )
            setTableData(newObj)
            


    }

}
 



function editMedsOnClick(event,data){

    console.log(event.currentTarget.parentNode.id)
    

}