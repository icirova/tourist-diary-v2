import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { CardsProvider } from './context/CardsContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { AiAssistantProvider } from './context/AiAssistantContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CardsProvider>
        <AiAssistantProvider>
          <App />
        </AiAssistantProvider>
      </CardsProvider>
    </AuthProvider>
  </React.StrictMode>,
)
