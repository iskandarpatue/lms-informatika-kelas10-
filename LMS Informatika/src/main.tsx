import React from 'react'
import ReactDOM from 'react-dom/client'
// Memanggil file program LMS Anda yang ada di folder yang sama
import App from './App' 
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
