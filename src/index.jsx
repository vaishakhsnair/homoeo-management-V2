import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './style/index.css';
import Home from './pages/Home';
import New from './pages/New';
import Revisit from './pages/Revisit';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/*<RouterProvider router={router} />*/ }
    <Home />

  </React.StrictMode>
);


