
const formdata = {
    "patientname":{label:"Name *"},
    "addr":{label:"Address *"},
    "phoneno":{label:"Phone Number *"},
    "age":{label:"Age *"},                    
}




const tablehtml = `             
            <tr>
                <th style="width: 3%;">Size</th>
                <th style="width: 5%;">Medium</th>
                <th style="width: 8%;">Meds</th>
                <th style="width: 8%;">Dosage</th>
                <th style="width: 2%;">Multiply</th>
                <th style="width: 2%;">Cost</th>



            </tr>`

const biginputs = ["historyinput","repertoryinput"]
const miniinputdivs = {"basicInfo":formdata}
const extras = {hidden:false,divs :['familyhiscontainer','repertory','past','pershisdiv','generalitydiv','respto', 'regi'] }
const primaryinfo = ["complaintinput","historyinput","basicInfo","gendersel"]

const params = new URLSearchParams(window.location.search)
var patientData = null


const PatientNum = params.get('patientno')
document.getElementById('patientno').textContent = PatientNum

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
                                <input id="${id}" placeholder="${placeholder}" readonly></input>
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
        
        if(complaints[date]['historyinput'] != null){
            var historytitle = document.createElement('p')
            historytitle.setAttribute('class','prevhistorytitle')
            historytitle.textContent = 'HPC :'

            var historyData = document.createElement('pre')
            historyData.setAttribute('class','prevhistory')
            historyData.textContent = `${complaints[date]['historyinput']}`
            container.appendChild(historytitle)
            container.appendChild(historyData)
        }
        



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

function refilldata(data){

    Object.keys(data).forEach(element => {
        switch(element){
            case 'primary':
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

                            //case 'historyinput':
                             //   input.innerText = data[element][category]
                             //   break
                            
        

                           /* default:
                                input.innerText = data[element][category]
                                break*/
                                

                        }
                        
                    }

                });
            
                break
            case 'optional':
                const repertorydata = data[element]['repertoryinput']
                document.getElementById('repertoryinput').innerText = repertorydata;
                break;
            default:
                break
                
            

            
            
        }
    });
}


function duplicatepres(date){
    const rowids = patientData.complaints[date]['prescriptions']
    const indexlist = {'container':1,'medium':2,'meds':3,'dos':4}


    Object.keys(rowids).forEach(row => {
        console.log(Object.keys(rowids[row]))
        newrowid = addrow()
        var newrow = document.getElementById(newrowid)

        Object.keys(rowids[row]).forEach(column => {

            switch(column){
                case 'container':
                case 'medium':
                    var serial = rowids[row][column][0]
                    xhr = sendpost('/api/inventory',{'request':'reverse','column':column,'serial':serial})
                    xhr.onload = function(){
                        var resp = JSON.parse(this.responseText)
                        console.log(resp,resp.data)
                        newrow.children[indexlist[column]].textContent = resp.data
                        newrow.children[indexlist[column]].serial = serial
                    }
    
                    break

                case 'meds':
                    for(i=0;i<rowids[row][column].length;i++){
                       var serial =  rowids[row][column][i]
                       console.log("meds serial :",serial)

                       xhr = sendpost('/api/inventory',{'request':'reverse','column':column,'serial':serial})
                       xhr.onload = function(){
                           var resp = JSON.parse(this.responseText)
                           console.log(resp,resp.data)
                           cellid = newrow.children[indexlist['meds']].id
                           setmeds(cellid,resp.data,resp.serial)
                           //newrow.children[indexlist[column]].textContent = resp.data
                           //newrow.children[indexlist[column]].serial = serial
                       }
                       
                    }
                    break
                
                case 'dos':
                    newrow.children[indexlist[column]].textContent = rowids[row][column]
                    break

                default:
                    break //catchall?

                
            }
            
        });

    });

}



function sendFollowupData(){
    var complaint = document.getElementById('complaintinput').textContent
    var prescriptions = getprescriptions()
    const patientno = document.getElementById('patientno').innerText
    const historycomplaint = document.getElementById('historyinput').textContent
    const repertoryinput = document.getElementById('repertoryinput').textContent
    const nextVisit = document.getElementById('nextvisitdate').value

    if(nextVisit.length === 0){
        alert("Required Field missing : Next Visit Date")
        return
    }
    
    //var attach = handleattachmentsubmit()
    if (complaint.length === 0){
        alert("Required Field missing : Complaints ")
        return
    }
    xhr = sendpost('/api/revisit',{'data':{'complaint':complaint,"nextVisit":nextVisit,"complaintHistory":historycomplaint,"repertoryData":repertoryinput,'prescription':prescriptions,'patientno':patientno,'totalcost':costtab}})
    xhr.onload = function(){
        console.log(this.responseText)
        const resp  = JSON.parse(this.responseText)
        if(resp.status === 'success'){

            alert(`Data added successfully for ID:${PatientNum}`)
            window.open(`/`,"_self")
        }
    }
}

function sendpost(url,data){
    var xhr  = new XMLHttpRequest();
    xhr.open("POST",url,true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
    return xhr
  }


document.addEventListener('click',function(event){
    console.log(event.target)
    const button = event.target
    console.log(button.className)
    switch(button.className){

        case 'duplicatepresbt':
            duplicatepres(button.id)
            break

        case 'submitbt':
            sendFollowupData()

        

    }


}
)

function init(){
    fillpage('basic',formdata)
    getpatientdata()
    populate('attachments')
    getAttachData(PatientNum)

}

init()




