document.addEventListener('click',function(event){
    switch(event.target.id){
        case 'new':
            document.getElementById('frame').src='/new'
            break
        case 'mmrp':
            document.getElementById('frame').src='/mmrp'
            break
        
        case 'patients':
            document.getElementById('frame').src='/patients'


    }

})