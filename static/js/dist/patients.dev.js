"use strict";

var basicbody = document.children[0].children[1].innerHTML;
var queryresponse = {};

function getpatientlist() {
  var qry = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  if (qry === null) {
    var sendreq = {
      "request": "list"
    };
  } else {
    var sendreq = {
      'request': 'search',
      'qry': qry
    };
  }

  var xhrobj = sendpost("/api/details", sendreq);

  xhrobj.onload = function () {
    var responsedata = JSON.parse(this.responseText).data;
    console.log(responsedata);
    queryresponse = responsedata;
    cleartable();
    filltable(responsedata);
  };
}

function cleartable() {
  var table = document.getElementById('outputbox');

  while (table.children[0].children.length > 1) {
    var len = table.children[0].children.length;
    table.children[0].children[len - 1].remove();
  }
}

function filltable(data) {
  var table = document.getElementById('outputbox');

  for (i = 0; i < data.length; i++) {
    var row = table.insertRow(i + 1);

    for (j = 0; j <= 4; j++) {
      var cell = row.insertCell(j);

      if (j == 4) {
        var btcontainer = document.createElement('div');
        btcontainer.setAttribute('class', 'btcontainer');
        var revisitbt = document.createElement('button');
        revisitbt.setAttribute('class', 'tablebt');
        revisitbt.textContent = 'follow up';
        revisitbt.setAttribute('onclick', "redirect('followup',\"".concat(data[i][0], "\")"));
        btcontainer.appendChild(revisitbt);
        var detailsbt = document.createElement('button');
        detailsbt.setAttribute('class', 'tablebt');
        detailsbt.setAttribute('onclick', "redirect('details',\"".concat(data[i][0], "\")"));
        detailsbt.textContent = 'details';
        btcontainer.appendChild(detailsbt);
        cell.appendChild(btcontainer);
      } else {
        cell.textContent = data[i][j];
      }
    }
  }
}

function sendpost(url, data) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(data));
  return xhr;
}

function redirect(dest, patientid) {
  switch (dest) {
    case 'followup':
      window.open("/followup?patientno=".concat(patientid), "_self");
      break;

    case 'details':
      window.open("/details?patientno=".concat(patientid), "_self");
      break;

    default:
      break;
  }
}

document.addEventListener('input', function (event) {
  switch (event.target.id) {
    case 'searchbar':
      getpatientlist(qry = event.target.value);
      break;

    default:
      break;
  }
});

function init() {
  document.getElementById('searchbar').value = '';
  getpatientlist();
}

init();