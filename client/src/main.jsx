import { StrictMode } from 'react'
import ReactDom from 'react-dom'
import ThemeProvider from '../context/ThemeContext.jsx'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <ThemeProvider>
    <App />
  </ThemeProvider>
  </StrictMode>,
)
