"use strict";

var formdata = {
  "patientname": {
    label: "Name *"
  },
  "addr": {
    label: "Address *"
  },
  "phoneno": {
    label: "Phone Number *"
  },
  "age": {
    label: "Age *"
  }
};
var tablehtml = "             \n            <tr>\n                <th style=\"width: 3%;\">Size</th>\n                <th style=\"width: 5%;\">Medium</th>\n                <th style=\"width: 8%;\">Meds</th>\n                <th style=\"width: 8%;\">Dosage</th>\n                <th style=\"width: 2%;\">Multiply</th>\n                <th style=\"width: 2%;\">Cost</th>\n\n\n\n            </tr>";
var biginputs = ["historyinput"];
var miniinputdivs = {
  "basicInfo": formdata
};
var extras = {
  hidden: false,
  divs: ['familyhiscontainer', 'repertory', 'past', 'pershisdiv', 'generalitydiv', 'respto', 'regi']
};
var primaryinfo = ["complaintinput", "historyinput", "basicInfo", "gendersel"];
var params = new URLSearchParams(window.location.search);
var patientData = null;
var PatientNum = params.get('patientno');
document.getElementById('patientno').textContent = PatientNum;

function fillpage(div, formdata) {
  console.log("E");
  var details = document.getElementById(div);
  keys = Object.keys(formdata);

  for (i = 0; i < keys.length; i++) {
    id = keys[i];
    label = formdata[id].label;
    placeholder = "Enter " + label;
    labelid = id + "label";
    customidcss = formdata[id].customidcss;
    customlabelcss = formdata[id].customlabelcss;
    var template = " <div id=".concat(id, "div>  \n                                <input id=\"").concat(id, "\" placeholder=\"").concat(placeholder, "\" readonly></input>\n                                <label for=\"").concat(id, "\" id=\"").concat(labelid, "\">").concat(label, "</label>\n                            </div>");
    details.insertAdjacentHTML('beforeend', template);

    if (customidcss === undefined) {
      customidcss = "";
    }

    if (customlabelcss === undefined) {
      customlabelcss = "";
    }

    var templatestyle = "\n                        <style>\n\n                        #".concat(id, "div{\n                            position : relative;\n                            padding : 30px;\n                            display: block;\n                        }\n\n                        #").concat(labelid, " {\n                            position: absolute;\n                            top:0;\n                            display: block;\n                            transition: 0.2s;\n                            }\n                            \n\n                        #").concat(id, " {\n                            color: #E9D5DA;\n                            width: 450px;\n                            height: 20px;\n                            border: 0;\n                            border-bottom: 2px solid #E9D5DA;\n                            outline: 0;\n                            color: #E9D5DA;\n                            background: transparent;\n                            transition: border-color 0.2s;\n                            }\n                            #").concat(id, "::placeholder {\n                            color: transparent;\n                            }\n                            #").concat(id, ":placeholder-shown ~ #").concat(labelid, " {\n                            cursor: text;\n                            top: 30px;\n                            }\n                            \n\n                            #").concat(id, ":focus {\n                            padding-bottom: 6px;\n                            color: #E9D5DA;\n                            font-size: 15px;\n                            border-width: 3px;\n                            border-image: linear-gradient(to right, #E9D5DA, #827397);\n                            border-image-slice: 1;\n                            }\n                            #").concat(id, ":focus ~ #").concat(labelid, " {\n                            position: absolute;\n                            top: 0;\n                            font-size: 13px;\n                            display: block;\n                            transition: 0.2s;\n                            color: #E9D5DA;\n                            border-bottom:1px solid #E9D5DA;\n                            }    \n                            \n                            #").concat(id, "{\n                            ").concat(customidcss, "\n                            }\n\n                            #").concat(labelid, "{\n                            ").concat(customlabelcss, "\n                            }\n\n                        </style>");
    details.insertAdjacentHTML('beforeend', templatestyle);
  }

  return 0;
}

function getpatientdata() {
  var patientno = params.get('patientno');
  xhrobj = sendpost('/api/details', {
    'request': 'refill',
    'qry': patientno
  });

  xhrobj.onload = function () {
    //console.log(this.responseText)
    resp = JSON.parse(JSON.parse(this.responseText).data[4]);
    patientData = resp;
    console.log(resp);
    fillprevdata(resp.complaints);
    refilldata(resp);
  };
}

function fillprevdata(complaints) {
  var prevdatadiv = document.getElementById('prevdata');
  Object.keys(complaints).forEach(function (date) {
    var complaint = complaints[date]['complaintinput'];
    var prescriptions = complaints[date]['prescriptions'];
    var container = document.createElement('div');
    container.setAttribute('class', 'prevdatacontainer');
    var textcontainer = document.createElement('div');
    textcontainer.setAttribute('class', 'prevdatatext');
    var datecontainer = document.createElement('div');
    datecontainer.setAttribute('class', 'prevtextdate');
    var complaintcontainer = document.createElement('div');
    complaintcontainer.setAttribute('class', 'prevtextcomplaint');
    datecontainer.textContent = "Date : ".concat(date);
    complaintcontainer.textContent = "Complaint : ".concat(complaint);
    textcontainer.appendChild(datecontainer);
    textcontainer.appendChild(complaintcontainer);
    var duplicatebt = document.createElement('button');
    duplicatebt.setAttribute('class', 'duplicatepresbt');
    duplicatebt.setAttribute('id', date);
    duplicatebt.textContent = 'Duplicate';
    textcontainer.appendChild(duplicatebt);
    container.appendChild(textcontainer);
    var table = document.createElement('table');
    table.setAttribute('class', 'prevdatatable');
    table.innerHTML = tablehtml;
    var finalcost = 0;
    Object.keys(prescriptions).forEach(function (rows) {
      var row = table.insertRow(table.children[0].children.length);
      Object.keys(prescriptions[rows]).forEach(function (column) {
        var currentColumn = prescriptions[rows][column];

        switch (column) {
          case 'meds':
            var cell = row.insertCell(2);
            cell.setAttribute('class', 'prevdatacell');

            var _loop = function _loop() {
              var serial = currentColumn[i];
              xhr = sendpost('/api/inventory', {
                "request": 'reverse',
                "column": column,
                "serial": serial
              });

              xhr.onload = function () {
                resp = JSON.parse(this.responseText).data;
                console.log('column : ', column, 'Value :', resp, 'Serial :', serial);
                var textbox = document.createElement('div');
                textbox.textContent = resp;
                cell.appendChild(textbox);
              };
            };

            for (i = 0; i < currentColumn.length; i++) {
              _loop();
            }

            break;

          case 'dos':
            var cell = row.insertCell(3);
            cell.textContent = currentColumn;
            break;

          case 'multiply':
            var cell = row.insertCell(4);
            cell.textContent = currentColumn;
            break;

          default:
            var index = Object.keys(prescriptions[rows]).indexOf(column);
            var cell = row.insertCell(index);
            xhr = sendpost('/api/inventory', {
              "request": 'reverse',
              "column": column,
              "serial": currentColumn[0]
            });

            xhr.onload = function () {
              cell.textContent = JSON.parse(this.responseText).data;
            };

            break;
        }
      });

      if (Object.keys(complaints[date]).includes('totalcost')) {
        var totalcost = complaints[date]['totalcost'];
        var costcell = row.insertCell(5);
        costcell.textContent = totalcost[rows]['sum'];
        finalcost += totalcost[rows]['sum'];
      }
    });
    var fincostcontainer = document.createElement('div');
    fincostcontainer.setAttribute('style', 'text-align:center;');
    fincostcontainer.textContent = "Total :".concat(finalcost + consultation);
    container.appendChild(table);
    container.appendChild(fincostcontainer);
    prevdatadiv.appendChild(container);
  });
}

function refilldata(data) {
  Object.keys(data).forEach(function (element) {
    switch (element) {
      case 'primary':
        var innerkeys = Object.keys(data[element]);
        innerkeys.forEach(function (category) {
          console.log(category);

          if (Object.keys(miniinputdivs).includes(category)) {
            Object.keys(miniinputdivs[category]).forEach(function (ids) {
              var input = document.getElementById(ids);
              input.value = data[element][category][ids];
            });
          } else {
            var input = document.getElementById(category);

            switch (category) {
              case 'gendersel':
                input.value = data[element][category];
                break;

              case 'historyinput':
                input.innerText = data[element][category];
                break;

              /* default:
                   input.innerText = data[element][category]
                   break*/
            }
          }
        });
        break;

      default:
        break;
    }
  });
}

function duplicatepres(date) {
  var rowids = patientData.complaints[date]['prescriptions'];
  var indexlist = {
    'container': 1,
    'medium': 2,
    'meds': 3,
    'dos': 4
  };
  Object.keys(rowids).forEach(function (row) {
    console.log(Object.keys(rowids[row]));
    newrowid = addrow();
    var newrow = document.getElementById(newrowid);
    Object.keys(rowids[row]).forEach(function (column) {
      switch (column) {
        case 'container':
        case 'medium':
          var serial = rowids[row][column][0];
          xhr = sendpost('/api/inventory', {
            'request': 'reverse',
            'column': column,
            'serial': serial
          });

          xhr.onload = function () {
            var resp = JSON.parse(this.responseText);
            console.log(resp, resp.data);
            newrow.children[indexlist[column]].textContent = resp.data;
            newrow.children[indexlist[column]].serial = serial;
          };

          break;

        case 'meds':
          for (i = 0; i < rowids[row][column].length; i++) {
            var serial = rowids[row][column][i];
            console.log("meds serial :", serial);
            xhr = sendpost('/api/inventory', {
              'request': 'reverse',
              'column': column,
              'serial': serial
            });

            xhr.onload = function () {
              var resp = JSON.parse(this.responseText);
              console.log(resp, resp.data);
              cellid = newrow.children[indexlist['meds']].id;
              setmeds(cellid, resp.data, resp.serial); //newrow.children[indexlist[column]].textContent = resp.data
              //newrow.children[indexlist[column]].serial = serial
            };
          }

          break;

        case 'dos':
          newrow.children[indexlist[column]].textContent = rowids[row][column];
          break;

        default:
          break;
        //catchall?
      }
    });
  });
}

function sendFollowupData() {
  var complaint = document.getElementById('complaintinput').textContent;
  var prescriptions = getprescriptions();
  var patientno = document.getElementById('patientno').innerText; //var attach = handleattachmentsubmit()

  if (complaint.length === 0) {
    alert("Required Field missing : Complaints ");
    return;
  }

  xhr = sendpost('/api/revisit', {
    'data': {
      'complaint': complaint,
      'prescription': prescriptions,
      'patientno': patientno,
      'totalcost': costtab
    }
  });

  xhr.onload = function () {
    console.log(this.responseText);
    var resp = JSON.parse(this.responseText);

    if (resp.status === 'success') {
      alert("Data added successfully for ID:".concat(PatientNum));
      window.open("/patients", "_self");
    }
  };
}

function sendpost(url, data) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(data));
  return xhr;
}

document.addEventListener('click', function (event) {
  console.log(event.target);
  var button = event.target;
  console.log(button.className);

  switch (button.className) {
    case 'duplicatepresbt':
      duplicatepres(button.id);
      break;

    case 'submitbt':
      sendFollowupData();
  }
});

function init() {
  fillpage('basic', formdata);
  getpatientdata();
  populate('attachments');
  getAttachData(PatientNum);
}

init();