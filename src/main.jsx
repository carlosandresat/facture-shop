import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import BillGenerator from './BillGenerator.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BillGenerator />
  </React.StrictMode>,
)
