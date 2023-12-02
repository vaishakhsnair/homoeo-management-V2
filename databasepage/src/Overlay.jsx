
import React, { useState,useEffect } from 'react';
import { MedSearchInputStuff } from './table';
var NewStuff = {}


export default function Overlay({ onClose,overlayMode,objEvent}){
    var overlayContent = null;
    switch(overlayMode){
      case 'addmeds':
        overlayContent = <AddMeds />
        break;
      case 'delmeds':
        overlayContent = <DelMeds />
        break;
      case 'modmeds':
        overlayContent = <ModMeds event={objEvent} />
        break;
    }

    return (
      <div className="overlay">
        <div className="overlay-content">
          {overlayContent}
          <button className='overlay-close-button' onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };


function DelMeds(){
    return(
      <div className='overlay-content-container'>
          <div className='overlay-title'>Remove An Entry</div>
          <MedSearchInputStuff />
    </div>
    )
}


export function ModMeds(Objevent){

  const event = Objevent.event
  const data = event.target.getAttribute('rowdata').split(',')
  const serial = event.target.parentElement.children[0].innerText

  
    return(
      <div className='overlay-content-container'>
          <div className='overlay-title'>Modify An Entry</div>
          <OverlayMedsTable data={data}/>

    </div>
    )
}


function AddMeds(){

    const [Count,setCount] = useState(0)

    useEffect(() => {
      fetch('/api/database',{method:"POST", headers: {"Content-Type": "application/json"},body:JSON.stringify({'request':'meds','type':'count'})}) // Replace with your API endpoint
        .then(response => response.json())
        .then(data => {
            setCount(parseInt(data.resp))
            console.log("lawd save me",data.resp)
        })
        .catch(error => console.log(error));
    }, []);

    var EmptyArray = Array.from({length: 7}).map(el => "")




  return(
    <div className='overlay-content-container'>
          <div className='overlay-title'>Add An Entry</div>
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
                </tr>
                <tr>
                  <td className='titem'>{Count+1}</td>
                  <td className='titem' ><input type="text" className='tinput' onInput={handleUserInput}/></td>
                  <td className='titem' ><input type="text" className='tinput' onInput={handleUserInput}/></td>
                  <td className='titem' ><input type="number" className='tinput' onInput={handleUserInput}/></td>
                  <td className='titem' ><input type="text" className='tinput' list='units' onInput={handleUserInput}/>    
                    <datalist id="units">
                      <option value="ML"></option>
                      <option value="GM"></option>
                      <option value="Other"></option>

                    </datalist>
                  </td>
                  <td className='titem' ><input type="number" className='tinput' onInput={handleUserInput}/></td>
                  <td className='titem' ><input type="number" className='tinput' onInput={handleUserInput}/></td>
                  <td className='titem' ><input type="text" className='tinput' onInput={handleUserInput}/></td>

                
                </tr>
                
            </table>



        <button className='overlay-submit-button' onClick={submitActionHandler} >Submit</button>
    </div>
    </div>
  )
}
function handleUserInput(event){  
  const serial = event.target.parentElement.parentElement.children[0].innerText
  const index = event.target.parentElement.cellIndex
  const value = event.target.value
  
  if(Object.keys(NewStuff).includes(serial)){
    NewStuff[serial][index] = value
  }else{
    NewStuff[serial] = Array.from({length: 7}).map(el => "")
    NewStuff[serial][0] = serial
    NewStuff[serial][index] = value
  }
}
function submitActionHandler(){

  fetch('/api/database',{method:"POST", 
        headers: {"Content-Type": "application/json"},
        body:JSON.stringify({'request':'meds','type':'add','data':NewStuff})}).then((response) => response.json()).then(data => alert(data.resp)).then(NewStuff = {}).then(refreshPage) // Replace with your API endpoint
}


class OverlayMedsTable extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
    }
}

  render(){
    return(
      <div>
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
            </tr>
            <tr>
              <td className='titem'>{this.state.data[0]}</td>
              <td className='titem' ><input type="text" className='tinput' onChange={this.handleEdit.bind(this)} value={this.state.data[1]}/></td>
              <td className='titem' ><input type="text" className='tinput' onChange={this.handleEdit.bind(this)} value={this.state.data[2]}/></td>
              <td className='titem' ><input type="number" className='tinput' onChange={this.handleEdit.bind(this)} value={this.state.data[3]}/></td>
              <td className='titem' ><input type="text" className='tinput' list='units' onChange={this.handleEdit.bind(this)} value={this.state.data[4]}/>    
                <datalist id="units">
                  <option value="ML"></option>
                  <option value="GM"></option>
                  <option value="Other"></option>

                </datalist>
              </td>
              <td className='titem' ><input type="number" className='tinput' onChange={this.handleEdit.bind(this)} value={this.state.data[5]}/></td>
              <td className='titem' ><input type="number" className='tinput' onChange={this.handleEdit.bind(this)} value={this.state.data[6]}/></td>
              <td className='titem' ><input type="text" className='tinput' onChange={this.handleEdit.bind(this)} value={this.state.data[7]}/></td>

            
            </tr>
            
        </table>
        <div className='overlay-button-box'>
          <button className='overlay-submit-button' onClick={this.deleteActionHandler.bind(this)} >Delete</button>
           <button className='overlay-submit-button' onClick={this.editSubmitActionHandler.bind(this)} >Edit</button>

        </div>
        </div>

      
    )
  }

  handleEdit(event){
    const index = event.target.parentElement.cellIndex
    var newdata = this.state.data
    newdata[index] = event.target.value
    this.setState(
      {
        data: newdata
      }
    )
  }

  editSubmitActionHandler(){
    var conf = window.confirm("Save Changes ?")
    if(conf == true){
    fetch('/api/database',{method:"POST", 
          headers: {"Content-Type": "application/json"},
          body:JSON.stringify({'request':'meds','type':'edit','data':this.state.data})}).then((response) => response.json()).then(data => alert(data.resp)).then(refreshPage) // Replace with your API endpoint
    }
  }

  deleteActionHandler(){
    var conf = window.confirm("Are you sure you want to delete this entry?")
    if(conf == true){
      fetch('/api/database',{method:"POST", 
      headers: {"Content-Type": "application/json"},
      body:JSON.stringify({'request':'meds','type':'delete','data':this.state.data})}).then((response) => response.json()).then(data => alert(data.resp)).then(refreshPage) // Replace with your API endpoint
    }

  }

    
}




function refreshPage() {
  window.location.reload(false);
}
