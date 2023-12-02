const formdata = {
    "patientname":{label:"Name *"},
    "addr":{label:"Address *"},
    "phoneno":{label:"Phone Number *"},
    "age":{label:"Age *"},                    
}


const famhis = { 

    "parentage":{label:"Parent Age",customidcss:"width:200px;",customlabelcss:"font-size:18px"},
    "health":{label:"Health and Occupation"},
    "consan" : {label:"Consanguity"},
    "famdisord":{label:"Familial Disorder"},
    "socpoc":{label:"Social Position"},
    "othermem":{label:"Other Family Members"}
}


const pershis = {

  "birthplace":{label:"Birth Place"},
  "vaccination":{label:"Vaccinations Taken"},
  "milestone":{label:"Milestones"},
  "childhood":{label:"Childhood"},
  "education":{label:"Education"},
  "occupation":{label:"Occupation"},
  "socialrel":{label:"Domestic and social relationship"},
  "habits":{label:"Habits and Addictions"},
  "maritalstat":{label:"  Marital Status"}
}

const general = {"appetite":{label:"Appetite"},
  "thirst":{label:"Thirst"},
  "desires":{label:"Desires"},
  "aversion":{label:"Aversion"},
  "intolerence":{label:"Intolerence"},
  "stool":{label:"Stool"},
  "menstrual":{label:"Menstrual History"},
  "obstetric":{label:"Obstetric History"},
  "others":{label:"Others"},
  "sleep":{label:"Sleep"},
  "dreams":{label:"Dreams"}                     
}

const responseto = {"fanning":{label:"Fanning"},
  "clothing":{label:"Clothing"},
  "openair":{label:"Open Air"},
  "seasonal":{label:"Seasonal"},
  "postural":{label:"Postural"},
  "time":{label:"Time"},
  "topr":{label:"Touch/Pressure"},
  "motion":{label:"Motion"},
  "bathing":{label:"Bathing"},
  "menses":{label:"Menses"},
  "elim":{label:"Elimination"},
  "food":{label:"Food"},
  "drinks":{label:"Drinks"},
  "thermre":{label:"Thermal Reaction"},
  "phycons":{label:"Physical Constitution"},
  "mentalsymp":{label:"Mental Symptoms"}
}
const regi = {"head":{label:"Head"},
"vertigo":{label:"Vertigo"},
"eyevis":{label:"Eye/Vision"},
"earhear":{label:"Ear/Hearing"},
"nose":{label:"Nose"},
"face":{label:"Face"},
"mouth":{label:"Mouth"},
"teegum":{label:"Teeth/Gums"},
"stomach":{label:"Stomach"},
"abdomen":{label:"Abdomen"},
"rectum":{label:"Rectum"},
"stool":{label:"Stool"},
"uriorgpros":{label:"Urinary Organs / Prostate"},
"genital":{label:"Genitalia"},
"lartracvoi":{label:"Larynx/Trachea/Voice"},
"respi":{label:"Respiration"},
"cough":{label:"Cough"},
"expector":{label:"Expectoration"},
"chest":{label:"Chest"},
"back":{label:"Back"},
"extrem":{label:"Extremities"},
"sledrem":{label:"Sleep/Dream"},
"fevchipersp":{label:"Fever,Chill,Perspiration"},
"skin":{label:"Skin"} 
}                
const biginputs = ["historyinput","pastinput","gendersel",'mindgeninput','repertoryinput']
const miniinputdivs = {"basicInfo":formdata,"familyHistory":famhis,"personalHistory":pershis,"Generalities":general,"responseTo":responseto,'regionals':regi}
const extras = {hidden:false,divs :['familyhiscontainer','repertory','past','pershisdiv','generalitydiv','respto', 'regi'] }

const primaryinfo = ["historyinput","basicInfo","gendersel"]


const tablehtml = `             
            <tr>
                <th style="width: 3%;">Size</th>
                <th style="width: 5%;">Medium</th>
                <th style="width: 8%;">Meds</th>
                <th style="width: 8%;">Dosage</th>
                <th style="width: 2%;">Multiply</th>
                <th style="width: 2%;">Cost</th>




            </tr>`


const params = new URLSearchParams(window.location.search)
const PatientNum = params.get('patientno')
document.getElementById('patientno').textContent = PatientNum

var patientData = null

function fillpage(div,formdata){
        console.log("E")
        var details = document.getElementById(div)

        keys = Object.keys(formdata)

        for (i=0;i<keys.length;i++){
                id = keys[i]
                label = formdata[id].label
                placeholder = "Enter "+label

                labelid = id+"label"
                customidcss = formdata[id].customidcss
                customlabelcss = formdata[id].customlabelcss


                var template = ` <div id=${id}div>  
                                <input id="${id}" placeholder="${placeholder}" ></input>
                                <label for="${id}" id="${labelid}">${label}</label>
                            </div>`

                details.insertAdjacentHTML('beforeend',template)


                if (customidcss === undefined){
                    customidcss = "" 
                }

                if (customlabelcss === undefined){
                    customlabelcss = "" 
                }

                var templatestyle = `
                        <style>

                        #${id}div{
                            position : relative;
                            padding : 30px;
                            display: block;
                        }

                        #${labelid} {
                            position: absolute;
                            top:0;
                            display: block;
                            transition: 0.2s;
                            }
                            

                        #${id} {
                            color: #E9D5DA;
                            width: 450px;
                            height: 20px;
                            border: 0;
                            border-bottom: 2px solid #E9D5DA;
                            outline: 0;
                            color: #E9D5DA;
                            background: transparent;
                            transition: border-color 0.2s;
                            }
                            #${id}::placeholder {
                            color: transparent;
                            }
                            #${id}:placeholder-shown ~ #${labelid} {
                            cursor: text;
                            top: 30px;
                            }
                            

                            #${id}:focus {
                            padding-bottom: 6px;
                            color: #E9D5DA;
                            font-size: 15px;
                            border-width: 3px;
                            border-image: linear-gradient(to right, #E9D5DA, #827397);
                            border-image-slice: 1;
                            }
                            #${id}:focus ~ #${labelid} {
                            position: absolute;
                            top: 0;
                            font-size: 13px;
                            display: block;
                            transition: 0.2s;
                            color: #E9D5DA;
                            border-bottom:1px solid #E9D5DA;
                            }    
                            
                            #${id}{
                            ${customidcss}
                            }

                            #${labelid}{
                            ${customlabelcss}
                            }

                        </style>`

                details.insertAdjacentHTML('beforeend',templatestyle)
                }
        return 0


}



function fillprevdata(complaints){

  var prevdatadiv = document.getElementById('prevdata')

  Object.keys(complaints).reverse().forEach(date => {
      var complaint = complaints[date]['complaintinput']
      var prescriptions = complaints[date]['prescriptions']   

      var container = document.createElement('div')
      container.setAttribute('class','prevdatacontainer')

      var textcontainer = document.createElement('div')
      textcontainer.setAttribute('class','prevdatatext')


      var  datecontainer = document.createElement('div')
      datecontainer.setAttribute('class','prevtextdate')

      var complaintcontainer = document.createElement('div')
      complaintcontainer.setAttribute('class','prevtextcomplaint')
      

      datecontainer.textContent = `Date : ${date}`
      complaintcontainer.textContent = `Complaint : ${complaint}`

      textcontainer.appendChild(datecontainer)
      textcontainer.appendChild(complaintcontainer)

      var duplicatebt = document.createElement('button')
      duplicatebt.setAttribute('class','duplicatepresbt')
      duplicatebt.setAttribute('id',date)
      duplicatebt.textContent  = 'Duplicate'

      textcontainer.appendChild(duplicatebt)


      container.appendChild(textcontainer)


      var table = document.createElement('table')        
      table.setAttribute('class','prevdatatable')

      table.innerHTML = tablehtml
      var finalcost = 0
      Object.keys(prescriptions).forEach(rows => {

          var row = table.insertRow(table.children[0].children.length)

          Object.keys(prescriptions[rows]).forEach(column =>{
              var currentColumn = prescriptions[rows][column]

              switch(column){
                  case 'meds':
                      var cell = row.insertCell(2)
                      cell.setAttribute('class','prevdatacell')

                      for(i = 0;i<currentColumn.length;i++){
                          const serial = currentColumn[i]

                          xhr = sendpost('/api/inventory',{"request":'reverse',"column":column,"serial":serial})
                          xhr.onload = function(){
                              resp = JSON.parse(this.responseText).data
                              console.log('column : ',column,'Value :',resp,'Serial :',serial)
                              var textbox = document.createElement('div')
                              textbox.textContent = resp
                              cell.appendChild(textbox)
                          }
                      }
                      break

                  case 'dos':
                      var cell = row.insertCell(3)
                      cell.textContent = currentColumn
                      break
                  
                  case 'multiply':
                      var cell = row.insertCell(4)
                      cell.textContent = currentColumn
                      break


                  default:
                      var index = Object.keys(prescriptions[rows]).indexOf(column)
                      var cell = row.insertCell(index)
                      xhr = sendpost('/api/inventory',{"request":'reverse',"column":column,"serial":currentColumn[0]})
                      xhr.onload = function(){
                          cell.textContent = JSON.parse(this.responseText).data
                      }
                      break

                      
              }

          })

          if(Object.keys(complaints[date]).includes('totalcost')){
              var totalcost = complaints[date]['totalcost']
              var costcell = row.insertCell(5)
              costcell.textContent = totalcost[rows]['sum']
              finalcost += totalcost[rows]['sum']
          }            

          
      });


      var fincostcontainer = document.createElement('div')
      fincostcontainer.setAttribute('style','text-align:center;')
      fincostcontainer.textContent = `Total :${finalcost+consultation}`

      container.appendChild(table)
      container.appendChild(fincostcontainer)
      prevdatadiv.appendChild(container)

  });

}



function getpatientdata(){
    const patientno = params.get('patientno')
    xhrobj = sendpost('/api/details',{'request':'refill','qry':patientno})
    xhrobj.onload = function(){
    //console.log(this.responseText)
        resp = JSON.parse(JSON.parse(this.responseText).data[4])
        patientData = resp
        console.log(resp)
        fillprevdata(resp.complaints)
        refilldata(resp)

    }
}


function fillprevdata(complaints){

    var prevdatadiv = document.getElementById('prevdata')

    Object.keys(complaints).forEach(date => {
        var complaint = complaints[date]['complaintinput']
        if(complaint === undefined){
          complaint = 'Not available'
        }
        var prescriptions = complaints[date]['prescriptions']   

        var container = document.createElement('div')
        container.setAttribute('class','prevdatacontainer')

        var textcontainer = document.createElement('div')
        textcontainer.setAttribute('class','prevdatatext')


        var  datecontainer = document.createElement('div')
        datecontainer.setAttribute('class','prevtextdate')

        var complaintcontainer = document.createElement('div')
        complaintcontainer.setAttribute('class','prevtextcomplaint')
        

        datecontainer.textContent = `Date : ${date}`
        complaintcontainer.textContent = `Complaint : ${complaint}`

        textcontainer.appendChild(datecontainer)
        textcontainer.appendChild(complaintcontainer)

        //var duplicatebt = document.createElement('button')
        //duplicatebt.setAttribute('class','duplicatepresbt')
        //duplicatebt.setAttribute('id',date)
        //duplicatebt.textContent  = 'Duplicate'

        //textcontainer.appendChild(duplicatebt)


        container.appendChild(textcontainer)


        var table = document.createElement('table')        
        table.setAttribute('class','prevdatatable')

        table.innerHTML = tablehtml
        var finalcost = 0

        Object.keys(prescriptions).forEach(rows => {

            var row = table.insertRow(table.children[0].children.length)
            var allserial = {}
            Object.keys(prescriptions[rows]).forEach(column =>{
                var currentColumn = prescriptions[rows][column]

                switch(column){
                    case 'meds':
                        var cell = row.insertCell(2)
                        cell.setAttribute('class','prevdatacell')

                        for(i = 0;i<currentColumn.length;i++){
                            const serial = currentColumn[i]

                            xhr = sendpost('/api/inventory',{"request":'reverse',"column":column,"serial":serial})
                            xhr.onload = function(){
                                resp = JSON.parse(this.responseText).data
                                console.log('column : ',column,'Value :',resp,'Serial :',serial)
                                var textbox = document.createElement('div')
                                textbox.textContent = resp
                                cell.appendChild(textbox)
                            }
                        }
                        allserial[column] = currentColumn
                        break

                    case 'dos':
                        var cell = row.insertCell(3)
                        cell.textContent = currentColumn
                        break

                    case 'multiply':
                      var cell = row.insertCell(4)
                      cell.textContent = currentColumn
                      break
  

                    default:
                        var index = Object.keys(prescriptions[rows]).indexOf(column)
                        var cell = row.insertCell(index)
                        xhr = sendpost('/api/inventory',{"request":'reverse',"column":column,"serial":currentColumn[0]})
                        xhr.onload = function(){
                            cell.textContent = JSON.parse(this.responseText).data
                        }
                        allserial[column] = currentColumn
                        break

                        
                }


            })


          if(Object.keys(complaints[date]).includes('totalcost')){
              var totalcost = complaints[date]['totalcost']
              var costcell = row.insertCell(5)
              costcell.textContent = totalcost[rows]['sum']
              finalcost += totalcost[rows]['sum']
          }            


            
            
        });
        var fincostcontainer = document.createElement('div')
        fincostcontainer.setAttribute('style','text-align:center;')
        fincostcontainer.textContent = `Total :${finalcost+consultation}`

        container.appendChild(table)
        container.appendChild(fincostcontainer)
        prevdatadiv.appendChild(container)

    });

}

function refilldata(data){

    Object.keys(data).forEach(element => {
        switch(element){
            case 'primary':
            case 'optional':
                const innerkeys = Object.keys(data[element])

                innerkeys.forEach(category => {
                    console.log(category)
                    if(Object.keys(miniinputdivs).includes(category)){
                            
                            Object.keys(miniinputdivs[category]).forEach(ids => {
                                    const input = document.getElementById(ids)
                                    input.value = data[element][category][ids]
                            });
                    }else{


                        const input = document.getElementById(category)
                        switch(category){
                            case 'gendersel':
                                input.value = data[element][category]
                                break
                             default:
                                input.innerText = data[element][category]
                                break
                                

                        }
                        
                    }

                });
                break
                
            case 'prescriptions':

            
            
        }
    });
}



function sendall(){
    allinputs  = biginputs.concat(Object.keys(miniinputdivs)) 
    date = document.getElementById('datein').textContent
  
    inputcontents = {}
    
    inputcontents['primary'] = {}
    inputcontents['primary']['basicInfo'] = {}
  
    inputcontents['optional'] = {}
  
   // inputcontents['complaints'] = {}
   // inputcontents['complaints'][date] = {}
  
  
    inputcontents["patientno"] = document.getElementById("patientno").innerText
  
    for(i=0;i<allinputs.length;i++){
      //console.log(allinputs[i],typeof(allinputs[i]))
  
  
      content = []
  
      if(Object.keys(miniinputdivs).includes(allinputs[i])){
         
         //console.log("SHU :",allinputs[i])
  
         for(element in miniinputdivs[allinputs[i]] ){
            
            //console.log("SHUR :",element)
            input = document.getElementById(element)
            content.push([element,input.value])
            //console.log("Dat :",content)
         }
  
      }else if(allinputs[i] === 'gendersel'){
        content = document.getElementById(allinputs[i]).value
  
  
      }else{
        input = document.getElementById(allinputs[i])
        content = input.innerText
  
      }
  
  
  
      console.log("fin:",content)
  
  
      if(primaryinfo.includes(allinputs[i])){
  
          switch(allinputs[i]){
            case "basicInfo":
  
                  content.forEach(element => {
                      console.log(element)
                      if (element[1].length == 0){
                        sendError("required")
                        return
                      }else{
                        inputcontents['primary'][allinputs[i]][element[0]] = element[1]
                      }
                  });
  
                  break
            
            case 'complaintinput':
                break
              //inputcontents['complaints'][date]['complaintinput'] = content
            
  
            default:
              inputcontents['primary'][allinputs[i]] = content
              break
  
          }
         
      }else{
        inputcontents['optional'][allinputs[i]] = content
  
        if(Object.keys(miniinputdivs).includes(allinputs[i])){
          inputcontents['optional'][allinputs[i]] = {}
  
          content.forEach(element => {
            inputcontents['optional'][allinputs[i]][element[0]] = element[1]
            
          });
      }
      
      }
    
  
  
  
  
    }
  
    //const prescriptions = getprescriptions()
    //inputcontents['complaints'][date]['prescriptions'] = 
    //inputcontents['complaints'][date]['prescriptions'] = prescriptions
  
    console.log(JSON.stringify(inputcontents))
    respobj =  sendpost('/api/miscdata',inputcontents)
    respobj.onload = function(){
      console.log(this.responseText)
      const resp = JSON.parse(this.responseText)
      if (resp.status === 'success'){
        alert('Details updated successfully')
        window.open(`/patients`,"_self")
      }else{
        sendError('server')
      }
      
    }

    handleattachmentsubmit(PatientNum)
  }
  
  
  
  
  function toggleextras(){
    if(extras.hidden === false){
      mode = true
      document.getElementById('toggle').innerText = 'More'
    }else{
      mode=false
      document.getElementById('toggle').innerText = 'Less'
    }
  
    for(i=0;i<extras.divs.length;i++){
      document.getElementById(extras.divs[i]).hidden = mode
    }
    extras.hidden = mode
  }
  
  
  function sendError(errortype){
    switch(errortype){
      case "required":
        console.log('required field is empty')
        errname = "Required Fields are missing."
        break    
  
      case 'server':
        errname = "Server encountered errors while adding patient"
  
    }
  
    notif = document.getElementById('notifspace')
    notif.setAttribute('class','onerror')
    notif.scrollIntoView()
  
    notif.innerText = errname
  
    setTimeout(function(){
      console.log("oke")
      notif.removeAttribute('class')
  
    },2000)
  
    setTimeout(function(){
      notif.innerText = ""
    },3000)
    
    throw new Error(errname)  
  
  }
  


function sendpost(url,data){
    var xhr  = new XMLHttpRequest();
    xhr.open("POST",url,true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
    return xhr
  }



function init(){
    fillpage("basic",formdata); //patient details
    fillpage("familyhis",famhis)
    fillpage("pershisinputs",pershis)
    fillpage("generalityinputs",general)
    fillpage("resptoinputs",responseto)
    fillpage("regiinputs",regi)
    getpatientdata()
    populate('attachments')

    getAttachData(PatientNum)

  }
  
  
  init()