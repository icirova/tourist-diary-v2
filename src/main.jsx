import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { CardsProvider } from './context/CardsContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CardsProvider>
      <App />
    </CardsProvider>
  </React.StrictMode>,
)
