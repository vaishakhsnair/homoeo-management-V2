
function inputwatcher(input,autofill,optionclassname){
    inputspace = document.getElementById(input)
    autofillspace = document.getElementById(autofill)
  
    inputspace.addEventListener("keyup",function(e){
      childrenoptions = autofillspace.children
  
      if([37,38,39,40].includes(e.keyCode) && childrenoptions.length>0){
  
  
        
        switch(e.keyCode){
          case 40:
            console.log("down")
            if(currfocus === null){
              currfocus = 0
              childrenoptions[currfocus].setAttribute("id",`${optionclassname}activeautofill`)
            }
  
            else{ 
              if (currfocus < childrenoptions.length-1){
                childrenoptions[currfocus].removeAttribute("id")
                currfocus += 1
                childrenoptions[currfocus].setAttribute("id",`${optionclassname}activeautofill`)
            }
          }
            inputspace.value = childrenoptions[currfocus].value
            childrenoptions[currfocus].scrollIntoView()
            break
  
          case 38:
            console.log("up")
            if(currfocus !== null && currfocus >0 && currfocus < childrenoptions.length){
              childrenoptions[currfocus].removeAttribute("id")
              currfocus -=1
              childrenoptions[currfocus].setAttribute("id",`${optionclassname}activeautofill`)
            }
            inputspace.value = childrenoptions[currfocus].value
            childrenoptions[currfocus].scrollIntoView()
  
            break
        }
          
      }
  
  
      if (inputspace.value.length>0 && !([37,38,39,40].includes(e.keyCode)) ){
  
          autofillspace.innerHTML = ""
          currfocus = null
  
          console.log(inputspace.value)
          xhrobj = sendpost("/autofill",{query:inputspace.value})
          xhrobj.onload = function(){
            console.log(this.responseText) 
            resp  =  JSON.parse(this.responseText).data
  
            for(i=0;i<resp.length;i++){
              autofillspace.innerHTML+= `<button class="${optionclassname}autofilloptions" value = '${resp[i]}'>${resp[i]}</button>`
            }
  
            autofillspace.addEventListener("click",function(e){
              inputspace.value = e.target.value
              autofillspace.innerHTML = ""
        
              })
  
          }
        }
    })
  }
  
  
  
  function sendpost(url,data){
    var xhr  = new XMLHttpRequest();
    xhr.open("POST",url,true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
    return xhr
  }