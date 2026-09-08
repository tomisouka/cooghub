import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UPLOAD_TOKEN } from './config/localAuth.js'

const nativeFetch = window.fetch.bind(window)
window.fetch = (input, init = {}) => {
  const url = typeof input === 'string' ? input : input.url
  if (url.startsWith('/api/')) {
    init = { ...init, headers: { ...(init.headers || {}), 'x-upload-token': UPLOAD_TOKEN } }
  }
  return nativeFetch(input, init)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
