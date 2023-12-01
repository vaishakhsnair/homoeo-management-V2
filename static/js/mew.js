



var formdata = {
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


const biginputs = ["historyinput","pastinput","gendersel",'mindgeninput','repertoryinput','complaintinput']
const miniinputdivs = {"basicInfo":formdata,"familyHistory":famhis,"personalHistory":pershis,"Generalities":general,"responseTo":responseto,'regionals':regi}
const extras = {hidden:false,divs :['familyhiscontainer','repertory','past','pershisdiv','generalitydiv','respto', 'regi','mind'] }

const primaryinfo = ["complaintinput","historyinput","basicInfo","gendersel"]

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
                                <input id="${id}" placeholder="${placeholder}"></input>
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







function sendpost(url,data){
  var xhr  = new XMLHttpRequest();
  xhr.open("POST",url,true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(data));
  return xhr
}


function sendall(){
  allinputs  = biginputs.concat(Object.keys(miniinputdivs)) 
  date = document.getElementById('datein').textContent

  inputcontents = {}
  
  inputcontents['primary'] = {}
  inputcontents['primary']['basicInfo'] = {}

  inputcontents['optional'] = {}

  inputcontents['complaints'] = {}
  inputcontents['complaints'][date] = {}

  const PatientNo = document.getElementById("patientnum").innerText
  inputcontents["patientno"] = PatientNo

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
                    if(element[0] === 'phoneno'){
                      if (element[1].length != 10){
                        sendError('numcount')
                        return
                      }
                    }
                    if (element[1].length == 0){
                      sendError("required")
                      return
                    }else{
                      inputcontents['primary'][allinputs[i]][element[0]] = element[1]
                    }
                });

                break
          
          case 'complaintinput':
            inputcontents['complaints'][date]['complaintinput'] = content
          

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

  const prescriptions = getprescriptions()
  inputcontents['complaints'][date]['attachments'] = handleattachmentsubmit(PatientNo)
  inputcontents['complaints'][date]['prescriptions'] = prescriptions
  inputcontents['complaints'][date]['totalcost'] = {}
  inputcontents['complaints'][date]['totalcost'] = costtab
  

  console.log(JSON.stringify(inputcontents))
  respobj =  sendpost('/api/registration',inputcontents)
  respobj.onload = function(){
    console.log(this.responseText)
    const resp = JSON.parse(this.responseText)
    if (resp.status === 'success'){
      alert(resp.message)
      window.open(`/patients`,"_self")
    }else{
      sendError('server')
    }
    
  }
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
      break
    
    case 'numcount':
      errname = 'Invalid Phone Number'

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


//function which runs at the start
function init(){
  fillpage("basic",formdata); //patient details
  fillpage("familyhis",famhis)
  fillpage("pershisinputs",pershis)
  fillpage("generalityinputs",general)
  fillpage("resptoinputs",responseto)
  fillpage("regiinputs",regi)
  toggleextras()
  populate('attachments')
}


init()