import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/montserrat/900.css'
import '@fontsource/bebas-neue/400.css'
import '@fontsource/orbitron/900.css'
import '@fontsource/rajdhani/700.css'
import '@fontsource/black-ops-one/400.css'
import '@fontsource/chakra-petch/700.css'
import '@fontsource/bungee/400.css'
import '@fontsource/saira-stencil-one/400.css'
import '@fontsource/russo-one/400.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
