/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
*************************************************************************/

import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './styles/theme.css'
import { initGA } from './utils/ga'

// Initialize GA4 — reads VITE_GA_MEASUREMENT_ID from env
initGA()

createRoot(document.getElementById('root')).render(
  <App />
)
