var overlay = document.getElementById('overlay')

function sendpost(url,data){
    var xhr  = new XMLHttpRequest();
    xhr.open("POST",url,true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
    return xhr
  }



function fillTableContents(){
    var table = document.getElementById('medslist')
    sendpost('/api/database',{'request':'meds','type':'list'}).onload = function(){
        resp = JSON.parse(this.responseText)
        resp.resp.slice().reverse().forEach(element => {
            var row = table.insertRow(table.children[0].children.length)

            for (let index = 0; index < element.length; index++) {
                const subelement = element[index];
                var cell = row.insertCell(index)
                cell.setAttribute('class','titem')
                cell.textContent = subelement

                
            }
        });
        
    }
}


function headerButtonAction(id){

    switch(id){
        case 'addmeds':
            overlayHTMLContents = ``
            break

        case 'delmeds':
            break
        case 'modmeds':
            break
    }
}

fillTableContents()

const headerButtons = document.querySelectorAll('.headerbt')

headerButtons.forEach(button => {
    button.addEventListener('click',function(event){
        console.log(event.target.id)
        headerButtonAction(event.target.id) 
    })
    
    
});


overlay.addEventListener('click',function(event){ 
    console.log(event.target)
    if(event.target.style.display == 'flex'){
        
        
    }
})