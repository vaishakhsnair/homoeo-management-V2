import '../style/Home.css';
import * as Table from '../HomeComponents/Table';
import React, { useState, useEffect } from 'react';
import Navbar from '../HomeComponents/Navbar';

function Home() {
  const [ data, setdata ] = useState('');
  return (
    <div className='App'>
      <Navbar></Navbar>
      <div className='title'>Patients</div>
      <Table.Load></Table.Load>
    </div>
  );
}
export default Home;
