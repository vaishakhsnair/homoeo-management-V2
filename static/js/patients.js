
const basicbody =  document.children[0].children[1].innerHTML
var queryresponse = {}
const table = document.getElementById('outputbox')
var AllData = null


function getpatientlist(qry = null){
    if(qry === null){
        var sendreq = {"request":"list"}
    }else{
        var sendreq = {'request':'search','qry':qry}
    }

    const xhrobj = sendpost("/api/details",sendreq)
    xhrobj.onload = function(){
        const responsedata = JSON.parse(this.responseText).data;
        console.log(responsedata)
        queryresponse = responsedata
        cleartable()
        filltable(responsedata)            
    }

}


function cleartable(){

    while(table.children[0].children.length > 1){
        var len = table.children[0].children.length
        table.children[0].children[len-1].remove()
    }
}


function filltable(data){

    for(i=0 ;i<data.length;i++){
        var row = table.insertRow(i+1)
        for(j=0 ; j <= 4 ; j++){
            var cell = row.insertCell(j) 
            if(j==4){
                var btcontainer = document.createElement('div')
                btcontainer.setAttribute('class','btcontainer')

                var revisitbt = document.createElement('button')
                revisitbt.setAttribute('class','tablebt')
                revisitbt.textContent = 'follow up'
                revisitbt.setAttribute('onclick',`redirect('followup',"${data[i][0]}")`)
                btcontainer.appendChild(revisitbt)

                var detailsbt = document.createElement('button')
                detailsbt.setAttribute('class','tablebt')
                detailsbt.setAttribute('onclick',`redirect('details',"${data[i][0]}")`)
                detailsbt.textContent = 'details'
                btcontainer.appendChild(detailsbt)

                cell.appendChild(btcontainer)

            }else{
                cell.textContent = data[i][j]
            }   
            
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


function redirect(dest,patientid){

    switch(dest){
        case 'followup':
            window.open(`/followup?patientno=${patientid}`,"_self")
            break
        case 'details':
            window.open(`/details?patientno=${patientid}`,"_self")
            break

        default:
            break

    }    
    
}

document.addEventListener('input',function(event){
    switch(event.target.id){
        case 'searchbar':
            getpatientlist(qry=event.target.value)
            break
            
        default:
            break
    }
})


headrow = document.getElementById('headrow')

headrow.addEventListener('click',function(event){
    console.log(event.target.id)
    switch(event.target.id){
        case 'pno':

    }
})

function init(){
    document.getElementById('searchbar').value = '';
    getpatientlist()
}

init()