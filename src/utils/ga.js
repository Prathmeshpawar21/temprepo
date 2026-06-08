/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
*************************************************************************/

import ReactGA from 'react-ga4'

export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID
  if (!measurementId) {
    console.warn('⚠️ VITE_GA_MEASUREMENT_ID not set — GA4 disabled')
    return
  }
  ReactGA.initialize(measurementId, {
    gaOptions: { send_page_view: false },
  })
}

export const trackPageView = (path) => {
  ReactGA.send({
    hitType: 'pageview',
    page: path,
  })
}
