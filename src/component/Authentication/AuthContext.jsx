/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import userAPI from '../../api/users/user';
import { initTokenRefresh, stopTokenRefresh } from '../../utils/tokenRefresh';
import patientProfileAPI from '../../api/patient/profile.api';


const AuthContext = createContext(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const profileFetchedRef = useRef(false); // 🔥 CRITICAL GUARD

  const isAuthenticated = Boolean(user && token);
  useEffect(() => {
  if (user && token && !profileFetchedRef.current) {
    fetchUserProfile();
  }
}, [user, token]);


  const updateUser = useCallback((updaterFn) => {
  setUser(prev => {
    const updated = typeof updaterFn === 'function' ? updaterFn(prev) : updaterFn;
    localStorage.setItem('user', JSON.stringify(updated)); // ✅ persists across refresh
    return updated;
  });
}, []);


  /* ---------------------------
     Sync profile → user state
  ----------------------------*/
const syncUserWithProfile = useCallback((profile) => {
  if (!profile || !user) return;

  const merged = {
    ...user,
    first_name:        profile.first_name        ?? user.first_name,
    last_name:         profile.last_name          ?? user.last_name,
    full_name:         profile.full_name          ?? user.full_name,
    email:             profile.email              ?? user.email,
    has_filled_intake: profile.has_filled_intake  ?? user.has_filled_intake,
    avatar:            profile.avatar_url         || user.avatar || null, // ✅ add this
  };

  setUser(merged);
  localStorage.setItem('user', JSON.stringify(merged));
}, [user]);


  /* ---------------------------
     FETCH PROFILE (ONCE ONLY)
  ----------------------------*/
const fetchUserProfile = useCallback(async () => {
  if (profileFetchedRef.current) {
    return userProfile;
  }

  try {
    profileFetchedRef.current = true;

    const res = await patientProfileAPI.getProfile(); // ✅ correct endpoint
    const profile = res.data;

    setUserProfile(profile);
    syncUserWithProfile(profile);

    return profile;

  } catch (err) {
    profileFetchedRef.current = false;

    if (err?.response?.status === 401 || err?.response?.status === 403) {
      logout();
    }

    throw err;
  }
}, [syncUserWithProfile, userProfile]);



  /* ---------------------------
     INIT AUTH (RUNS ONCE)
  ----------------------------*/
const initRanRef = useRef(false)

useEffect(() => {
  if (initRanRef.current) return
  initRanRef.current = true

const initAuth = async () => {
  setIsLoading(true)

  try {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('access_token')
    const refreshToken = localStorage.getItem('refresh_token')

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setToken(storedToken)

      if (refreshToken) initTokenRefresh()

      await fetchUserProfile()
    }
  } finally {
    setIsLoading(false)
  }
}



  initAuth()
}, [])


  /* ---------------------------
     LOGIN / LOGOUT
  ----------------------------*/
  const login = () => {
    window.location.href = '/login';
    // window.location.href = '/authentication';
  };

const logout = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  const portal       = localStorage.getItem('portal') || 'patient';

  stopTokenRefresh();
  profileFetchedRef.current = false;

  // ✅ Revoke Keycloak session before clearing local state
  if (refreshToken) {
    try {
      await userAPI.logout(refreshToken, portal);
      console.log('✅ Keycloak session revoked');
    } catch (err) {
      // Session may already be expired — still proceed with local logout
      console.warn('⚠️ Logout API failed (already expired?):', err.message);
    }
  }

  localStorage.clear();
  setUser(null);
  setUserProfile(null);
  setToken(null);

  window.location.href = '/login';
};
  /* ---------------------------
     AUTH STATE UPDATE (NO PROFILE FETCH HERE)
  ----------------------------*/
const updateAuthState = useCallback(
  async (userData, accessToken, refreshToken = null) => {

    const normalizedUser = {
      id: userData.id,
      keycloak_id: userData.keycloak_id,
      email: userData.email,
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      full_name: userData.full_name || '',
      role: userData.role,
      has_filled_intake: userData.has_filled_intake || false,
    };

    setUser(normalizedUser);
    setToken(accessToken);

    localStorage.setItem('user', JSON.stringify(normalizedUser));
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('keycloak_id', normalizedUser.keycloak_id);

    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
      initTokenRefresh();
    }

    // ⭐ FETCH PROFILE IMMEDIATELY AFTER LOGIN
      try {
        const res = await patientProfileAPI.getProfile();   // <-- /profiles/me
        const profile = res.data;

        const mergedUser = {
          ...normalizedUser,
          first_name: profile.first_name,
          last_name: profile.last_name,
          avatar: profile.avatar_url || null,
        };

        setUser(mergedUser);
        setUserProfile(profile);

        localStorage.setItem('user', JSON.stringify(mergedUser));

      } catch (err) {
        console.error("Failed to fetch profile after login", err);
      }
  },
  []
);

  const getAuthHeader = () => {
    const t = token || localStorage.getItem('access_token');
    return t ? { Authorization: `Bearer ${t}` } : {};
  };

  const hasRole = (role) =>
    user?.role === role || user?.roles?.includes(role);

  const contextValue = {
    isAuthenticated,
    user,
    userProfile,
    token,
    isLoading,
    login,
    logout,
    updateAuthState,
    fetchUserProfile,
    getAuthHeader,
    updateUser,
    hasRole,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
