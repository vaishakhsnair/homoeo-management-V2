import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './style/index.css';
import Home from './pages/Home';
import New from './pages/New';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },{
    path: "/revisit",
    element:<Home />,
  },
  {
    path: "/new",
    element:<New />,
  }
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);


