import './Home.css';
import * as Table from './HomeComponents/Table';
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

function Home() {
  const [ data, setdata ] = useState('');
  return (
    <div className='App'>
      <Navbar></Navbar>
      <div className='title'>Patients</div>
      <div className='searchstuff'>
        <div className='searchtext'>Search :</div>
        <input onChange={e=>{
          Table.Search(e.target.value)
        }} className='searchbar' ></input>
      </div>
      <Table.Load></Table.Load>
    </div>
  );
}
export default Home;
