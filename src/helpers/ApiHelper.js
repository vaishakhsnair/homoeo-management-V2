
export function sendPost(url,data){
    var xhr  = new XMLHttpRequest();
    xhr.open("POST",url,true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
    return xhr
  }

