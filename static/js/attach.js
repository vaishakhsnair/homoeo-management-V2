var allAttachs = null

function populate(parentDivId){
    const parentDiv = document.getElementById(parentDivId)
    var maindiv =  `
                        <form id='attachmentform' '>
                           <div><u> Attach Files</u> :<br> <input name='attachfiles' type='file' id='files' multiple  ></input></div>
                           <div id='attachmentlist'></div> 
                           <div id='existattach'><u>Existing Files</u></div>
                           <div id='attachmentviewer' style="display:flex;flex-direction:column;"></div>
                        </form> 

                    `
    parentDiv.innerHTML = maindiv
    
}


function setviewer(event){
        console.log(event.target.files.length)
        var attachmentlist = document.getElementById('attachmentlist')
        attachmentlist.innerHTML = ''
        var filelist = event.target.files
        allAttachs = filelist

        for(i=0;i<filelist.length;i++){
            var file = filelist[i]
            console.log(file.name)
            var innerdiv = document.createElement('div')
            innerdiv.file = file
            innerdiv.innerHTML = `${i+1}. ${file.name}  <button type='button' class='viewbt'>View</button>`
            attachmentlist.appendChild(innerdiv)


            
        }
        



    
}

function handleView(target=null){
    if (target.parentElement.filelink == null){
        console.log(target.parentElement.file)
        var url = URL.createObjectURL(target.parentElement.file)
    }else{
        url = target.parentElement.filelink
    }
        console.log(url)
        var viewspace=document.getElementById('attachmentviewer')
        if(viewspace.children.length>=1){
            var embed = viewspace.children[0]
            embed.setAttribute('src',url)


        }else{
            var embed = document.createElement('embed')
            embed.setAttribute('class','attachmentembeds')
            embed.setAttribute('style',"width:80%;align-self:center;height:500px;max-height:max-content; overflow-y: auto;")
            embed.setAttribute('src',url)
            viewspace.appendChild(embed)


        }

}

function handleattachmentsubmit(PatientNum){
    if(allAttachs == null){
        return 'Empty stuff'
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/attachments"); 
    xhr.onload = function(event){ 
        console.log(event.target.response); // raw response

    }; 
    // or onerror, onabort
    var formData = new FormData(document.getElementById("attachmentform")); 
    formData.append('PID',PatientNum)
    xhr.send(formData);
    return PatientNum

}


function getAttachData(PatientNum){
    //var stuff = {}
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `/api/attachments?pid=${PatientNum}`); 
    xhr.onload = function(event){ 
        console.log(event.target.response); // raw response
        const resp = JSON.parse(event.target.response)
        if ( resp.status === 'success' ){
            const files = resp.contents
            setExist(PatientNum,files)

            
        }else{
            setExist(PatientNum,[])
        }
    }; 
    xhr.send(null)
}

function setExist(PatientNum,filelist){
    existspace = document.getElementById('existattach')
    if(filelist.length === 0){
        existspace.innerHTML += '<br>-- No Files --<br>'
    }
    for(i=0;i<filelist.length;i++){
        var file = filelist[i]
        console.log(file)
        var innerdiv = document.createElement('div')
        innerdiv.filelink = `/api/attachments?pid=${PatientNum}&files=${file}`
        innerdiv.innerHTML = `${i+1}. ${file}  <button type='button' class='viewbt'>View</button>`
        existspace.appendChild(innerdiv)


        
    }

}

document.addEventListener('change',function(event){
    console.log(event.target)
    switch(event.target.id){
        case 'files':
            setviewer(event)
            break

    }
})

document.addEventListener('click',function(event){
    console.log(event.target.className)
    switch(event.target.className){
        case 'viewbt':
            handleView(event.target)
            break


    }


})


function sendpost(url,data){
    var xhr  = new XMLHttpRequest();
    xhr.open("POST",url,true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
    return xhr
  }