import { createRoot } from 'react-dom/client'
import App from './src/App.jsx'
import { BrowserRouter } from 'react-router-dom'
import React from "react";

createRoot(document.getElementById('main')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)