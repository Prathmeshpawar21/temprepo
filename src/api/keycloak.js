/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

const portal = localStorage.getItem('portal');
const clientId =
  portal === 'doctor'
    ? import.meta.env.VITE_KEYCLOAK_CLIENT_DOCTOR
    : import.meta.env.VITE_KEYCLOAK_CLIENT_PATIENT;

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId,
});


console.log('Keycloak initialized with clientId:', clientId);
console.log('Keycloak Instance:', keycloak);

