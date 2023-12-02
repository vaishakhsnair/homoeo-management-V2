import Table from './table';
import Overlay,{MedSearchInputStuff} from './Overlay'
import React, { useState } from 'react';
import './css/dist/App.css';


export default function App(){
    const [showOverlay, setShowOverlay] = useState(false);
    const [overlayMode, setOverlayMode] = useState('');
    const [objEvent, setobjEvent] = useState('');

  const handleButtonClick = event => {
    var buttonMode = event.currentTarget.id;
    console.log('triggered',buttonMode)

    setShowOverlay(true);
    setOverlayMode(buttonMode);
    setobjEvent(event);


  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
    setOverlayMode('');
  };

  return (
    <div>
      <div class="header">
        <button class="headerbt" onClick={handleButtonClick} id="addmeds">Add Meds</button>
      </div>
      <Table editButtonClickAction = {handleButtonClick}/>
      {showOverlay && <Overlay onClose={handleCloseOverlay} overlayMode={overlayMode} objEvent = {objEvent}/>}  
    </div>
  );
}
