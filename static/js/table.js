
addbutton = document.getElementById('addbutton')
const rowlen = ['serial','container','medium','meds','dos','cost','multiply','remove','duplicate']
var costtab = {}
var finalsum = {}
var totalrowcount = 0
var consultation = 100
const AUTOFILLENDPOINT = '/api/autofill'


function addrow(){
    rowid = `row${totalrowcount}`
    table = document.getElementById('table')
    var currlen = table.children[0].children.length
    currrow = table.insertRow(currlen)
    currrow.setAttribute('id',`row${totalrowcount}`)
    currrow.setAttribute('class',`tablerow`)
    costtab[rowid] = []

    for(i=0;i<rowlen.length;i++){
        currcell = currrow.insertCell(i)
        cellid = `${rowlen[i]}of${totalrowcount}`
        cellname = rowlen[i]
        cellnum = i
        console.log(cellid)
        currcell.setAttribute('id',cellid)

            switch(cellnum){
                case 0:
                    currcell.textContent = currlen
                    break

                case 3:
                    inputdiv = document.createElement('input')
                    inputdiv.setAttribute('id',`input${cellid}`)
                    inputdiv.setAttribute('class','medsinputdiv')
                    inputdiv.setAttribute('onclick',`handlemedsclick('input${cellid}','${cellid}')`)
                    currcell.appendChild(inputdiv)
                    break

                case 4:
                    currcell.contentEditable = true
                    break

                
                case 5:
                    currcell.setAttribute('onclick',`costcalc('${rowid}')`)
                    break

                case 6:
                    inputnum = document.createElement('input')
                    inputnum.setAttribute('type','number')
                    inputnum.setAttribute('class','multiplier')
                    inputnum.setAttribute('style','width:50px;')
                    inputnum.setAttribute('onclick','setmultiplier(this);')
                    currcell.appendChild(inputnum)
                    break                   

                case 7:
                    removerowbt = document.createElement('button')
                    removerowbt.textContent = 'X'
                    removerowbt.setAttribute('class','rowremove')
                    removerowbt.setAttribute('onclick',`removerow('row${totalrowcount}')`)
                    currcell.appendChild(removerowbt)
                    break
                case 8:
                    duplicaterowbt = document.createElement('button')
                    duplicaterowbt.textContent = '+'
                    duplicaterowbt.setAttribute('class','rowremove')
                    duplicaterowbt.setAttribute('onclick',`duplicaterow('row${totalrowcount}')`)
                    currcell.appendChild(duplicaterowbt)
                    break



                default:
                  //  input = document.createElement('input')
                   // input.setAttribute('id',`input${cellid}`)
                    //input.setAttribute('class','stuffinput')
                    currcell.setAttribute('onclick',`handleclick(${cellnum},'${cellid}')`)
                   // currcell.appendChild(input)
                    break

            }

    }
    
    totalrowcount += 1
    return rowid

}

function handleclick(cellnum,cellid){
    done = false
    cell = document.getElementById(cellid)
    input = document.getElementById(`input${cellid}`)

    activecells = document.getElementsByClassName('activecell')
    if( activecells.length !== 0){
        activecells[0].contentEditable = false

        activecells[0].removeAttribute('class')
    }
    cell.setAttribute('class','activecell') 

    if(!cell.contains(document.getElementById('activeautofill'))){
        preexist = document.getElementById('activeautofill')
        if( preexist !== null){
            preexist.remove()
        }
    }


   cell.contentEditable = true
    cell.focus()

    cell.addEventListener('keydown',function(event){

        if(event.keyCode == 13 && cellnum !== rowlen.length-1 && cellnum !== 3){ // only fires if enter/not last cell or if meds cell
            event.preventDefault() //cancels enter key
            currlen = table.children[0].children.length-1
            console.log('cellnum :',rowlen[cellnum])
            newcellid = `${rowlen[cellnum+1]}${currlen}`
            console.log(newcellid)
            this.removeEventListener('keydown',arguments.callee,false);
            handleclick(cellnum+1,newcellid) //changes focus to next cells
            done = true
        }
    })

    if(done){
        return 0 //avoid listening finished cells
    }

    cell.addEventListener('input',function(event){

        removeautofill()
        console.log(event.keyCode)
        
        content = cell.textContent
        console.log(content)
        xhrobj = sendpost(AUTOFILLENDPOINT,{query:content,asker:rowlen[cellnum]})
        xhrobj.onload = function(){
            console.log(this.responseText) 
            resp  =  JSON.parse(this.responseText).data
            
            switch (cellnum){
                
                case 3:
                    createautofill(cellid,resp,clickevent='setmeds')
                    break


                default:
                    createautofill(cellid,resp)
                    break
            }
        }
    })

    
}


function createautofill(cellid,data,clickevent='setautofill'){
    removeautofill()
    cell = document.getElementById(cellid)

    newdiv = document.createElement('div')
    newdiv.setAttribute('id','activeautofill')
    for(i=0;i<data.length;i++){
        nowlist = data[i]
        serial = nowlist.shift()
        entry = document.createElement('div')
        entry.setAttribute('class','autofilloption')
        entry.setAttribute('onclick',`${clickevent}('${cellid}','${nowlist.join(' ')}',${serial})`)
        entry.setAttribute('serial',serial)
        entry.textContent = nowlist.join(' ')
        newdiv.appendChild(entry)
    }
    cell.appendChild(newdiv)

    }



function setautofill(cellid,value,serial){

    
    cell = document.getElementById(cellid)
    preexist = document.getElementById('activeautofill')
    if( preexist !== null){
        preexist.remove()
    }
    cell.textContent = value
    cell.serial = serial
    costcalc(cell.parentElement.id)


}

function setmultiplier(el){
    console.log(el.id)
    costcalc(el.parentElement.parentElement.id) //rowid
  //  el.contentEditable = true


}


function costcalc(rowid){
    var allserial = {}
    const row = document.getElementById(rowid)
    console.log(cellid,row)
    var rowel = row.children
    for(var i = 1;i<=3;i++){
        switch(i){
            case 3:
               const meds =  rowel[i].children;
               allserial[rowlen[i]] = []
               for(each of meds){
                    if(each.serial !== undefined){
                        allserial[rowlen[i]].push(each.serial)
                    }

               }
               break
            default:

                allserial[rowlen[i]] = [rowel[i].serial]
                
        }
    }

    var multiplier = parseInt(row.children[6].children[0].value)
    if(isNaN(multiplier)===true){
        row.children[6].children[0].value = 1
        multiplier = 1
    }
    console.log('multiplier :',multiplier)

    console.log('all serial :',allserial)
    xhrresp = sendpost('/api/cost',allserial)
    xhrresp.onload = function(){
        console.log(this.responseText)
        var resp = JSON.parse(this.responseText)
        if (resp.status == 'error' && resp.message == 'too fast'){
            costcalc(rowid)
            return 0;
        }else{
            resp = resp.data


        }

        costtab[rowid] = resp

        costtab[rowid].multiplier = multiplier
        row.children[5].textContent = resp.sum * multiplier//setting cost value
        s = 0
        for(each of Object.keys(costtab)){
            s+= (costtab[each].sum)*(costtab[each].multiplier)
            console.log(s)
           }

        s = Math.ceil(s)
        if(s<50){
            rounded = Math.round(s/10)*10
        }else if(s<100 && s>50){
            rounded =Math.round(s/10)*10
        }else{
            rounded = Math.round(s/10)*10
        }
        if(s !== NaN && typeof(s) === 'number'){          
            document.getElementById('totalcost').innerText = rounded+consultation
            finalsum = {'raw':s,'rounded':rounded,'const':consultation,'multiplier':multiplier}

        }

        }        

}


function removeautofill(){
    preexist = document.getElementById('activeautofill')
    if( preexist !== null){
        preexist.remove()
    }

}

function setmeds(cellid,value,serial){

    cell = document.getElementById(cellid)
    removeautofill()
    inputspace = cell.children[0]

    inputspace.value = ''

    innerdiv = document.createElement('div')
    innerdiv.setAttribute('id',`${cell.children.length}${cellid}`)
    innerdiv.setAttribute('class','medsentry')
    innerdiv.serial = serial
    
    textdiv = document.createElement('div')
    textdiv.setAttribute('class','medsentrytext')
    textdiv.innerText = value
    innerdiv.appendChild(textdiv)

    removebutton  = document.createElement('button')
    removebutton.setAttribute('class','removebt')
    removebutton.textContent = 'X'
    removebutton.setAttribute('onclick',`removemedsentry('${cell.children.length}${cellid}')`)
    innerdiv.appendChild(removebutton)

    cell.appendChild(innerdiv)
    rowid  = cell.parentElement.id
    costcalc(rowid)

}

function handlemedsclick(inputid,cellid){
    cell = document.getElementById(cellid)
    console.log(inputid,cellid)

    activecells = document.getElementsByClassName('activecell')
    if( activecells.length !== 0){
        activecells[0].contentEditable = false

        activecells[0].removeAttribute('class')
    }
    cell.setAttribute('class','activecell') 

    removeautofill()

    watch = document.getElementById(inputid)
    watch.addEventListener('keyup',function(event){
        content = watch.value
        xhrobj = sendpost(AUTOFILLENDPOINT,{query:content,asker:'meds'})
        xhrobj.onload = function(){

            console.log(this.responseText) 
            resp  =  JSON.parse(this.responseText).data
            createautofill(cellid,resp,clickevent='setmeds')

        }


    })
}

function removemedsentry(innerdivid){
    var innerdiv = document.getElementById(innerdivid)
    const rowid = innerdiv.parentElement.parentElement.id
    document.getElementById(innerdivid).remove()

    costcalc(rowid)

}


function removerow(rowid){
    document.getElementById(rowid).remove()
    delete costtab[rowid]
    table = document.getElementById('table')
    currlen = table.children[0].children.length
    if(currlen>1){
        for(i=1;i<currlen;i++){
            table.children[0].children[i].children[0].textContent = i //just the index of the serial column nothin
        }
    }
}

function duplicaterow(rowid){
    console.log('hemlp')
    rowtoclone =  document.getElementById(rowid)
    originchildren = rowtoclone.children
    newrowid = addrow()
    newrow = document.getElementById(newrowid)
    
    for(i=0;i<originchildren.length;i++){
        switch(i){
            case 1: //fallthrough
            case 2:
                newrow.children[i].serial = originchildren[i].serial
                newrow.children[i].textContent = originchildren[i].textContent
                break
            
            case 3:
                meds = originchildren[i].children
                for(j=1;j<meds.length;j++){

                    cellid = newrow.children[i].id
                    serial = meds[j].serial
                    value = meds[j].children[0].textContent
                    setmeds(cellid,value,serial)
                }
                break



        }
    }


}


function getprescriptions(){
    const table = document.getElementById('table')
    const rows = table.children[0].children 
      
    var allserial = {}
  
    for(count = 1;count<rows.length;count++){
      const row = rows[count]
      const rowel = row.children
      allserial[row.id] = {}
        for(var i = 1;i<=6;i++){
            switch(i){
                case 3:
                  const meds =  rowel[i].children;
                  allserial[row.id][rowlen[i]] = []
                  for(each of meds){
                        if(each.serial !== undefined){
                            allserial[row.id][rowlen[i]].push(each.serial)
                        }
  
                  }
                  break
  
                case 4:
                  allserial[row.id][rowlen[i]] = rowel[i].textContent
                  break

                case 6:
                    allserial[row.id][rowlen[i]] = rowel[i].children[0].value
                    break
  
                case 1:
                case 2:
                    allserial[row.id][rowlen[i]] = [rowel[i].serial]
                    break
            }
        }
    }
  
    return allserial
  }

function sendpost(url,data){
    var xhr  = new XMLHttpRequest();
    xhr.open("POST",url,true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
    return xhr
  }

