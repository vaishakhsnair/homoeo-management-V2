"use strict";

var mapping = {
  'repertory': 'repertoryoutput',
  'medica': 'medicaoutput'
}; //for autofill

document.addEventListener('input', function (event) {
  var element = event.target;

  if (element.className === 'inputs') {
    var qrystr = element.value;

    if (qrystr.length > 0) {
      var asker = element.getAttribute('asker');
      obj = sendpost('/api/mmrp', {
        "method": "autofill",
        "query": qrystr,
        "asker": asker
      });

      obj.onload = function () {
        console.log(this.responseText);
        var resp = JSON.parse(this.responseText).data;
        handleautofill(asker, resp, qrystr);
      };
    } else {
      var container = document.getElementById(mapping[element.getAttribute('asker')]); //clearing output

      container.parentElement.hidden = true;
      var headrow = container.children[0];
      container.innerHTML = '';
      container.appendChild(headrow);
    }
  }
}); //for buttonclick

document.addEventListener('click', function (event) {
  console.log(event.target, event.target.id);
  var button = event.target;
  var container = button.parentElement;

  switch (button.classList[0]) {
    case 'editbutton':
      handledit(container, button); //to enable edit and change to confirm

      break;

    case 'confirmedit':
      handlevaluesubmit(container, button); //to revert back and append data

      break;
  }
});

function handledit(container, button) {
  var textspace = container.children[0];
  button.textContent = 'Confirm';
  button.removeAttribute('class');
  button.setAttribute('class', 'confirmedit');
  textspace.contentEditable = true;
  textspace.focus();
}

function handlevaluesubmit(container, button) {
  var textspace = container.children[0];
  var newvalue = textspace.textContent;
  var serial = textspace.serial;
  console.log(serial, newvalue);
  obj = sendpost('/api/mmrp', {
    'method': 'modify',
    'serial': serial,
    'value': newvalue
  });

  obj.onload = function () {
    resp = JSON.parse(this.responseText);
    console.log(resp);

    if (Object.keys(resp).includes('error')) {
      console.log('Failed,Error :', resp.error, 'Type', resp.type);
    } else {
      console.log('Modified Value Successfully');
      button.textContent = 'edit';
      textspace.contentEditable = false;
      button.removeAttribute('class');
      button.setAttribute('class', 'editbutton');
    }
  };
}

function handleautofill(asker, data, qry) {
  var container = document.getElementById(mapping[asker]);
  container.parentElement.hidden = false;
  console.log(container);
  autofill = document.getElementsByClassName(asker + 'row');
  headrow = container.children[0];
  container.innerHTML = '';
  container.appendChild(headrow);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      each = _step.value;
      var newrow = container.insertRow(container.children.length);
      newrow.setAttribute('class', asker + 'row');

      for (i = 0; i < each.length; i++) {
        var cell = document.createElement('td');

        if (asker === 'medica' && i === 2) {
          var _container = document.createElement("div");

          _container.setAttribute('class', 'indicationeditcontainer');

          var textspace = document.createElement('div');
          textspace.textContent = each[i];
          textspace.serial = each[0];
          textspace.setAttribute('style', 'width:90%;');
          var editbutton = document.createElement('button');
          editbutton.setAttribute('class', 'editbutton');
          editbutton.setAttribute('id', 'editbutton' + each[0]);
          editbutton.textContent = 'Edit';
          editbutton.setAttribute('style', 'width:10%;');

          _container.appendChild(textspace);

          _container.appendChild(editbutton);

          cell.appendChild(_container);
        } else {
          cell.textContent = each[i];
        }

        newrow.appendChild(cell);
      }

      container.appendChild(newrow);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
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