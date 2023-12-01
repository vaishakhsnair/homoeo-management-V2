"use strict";

function getpatientlist() {
  var xhrobj = sendpost("/followup", {
    "request": "list"
  });

  xhrobj.onload = function () {
    var responsedata = JSON.parse(this.responseText).data;
    console.log(responsedata);
  };
}

function sendpost(url, data) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(data));
  return xhr;
}