import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, AuthSession, Role } from '../types';

interface AuthContextType {
  currentUser: UserAccount | null;
  sessionToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  activeSessions: AuthSession[];
  login: (identifier: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: any) => Promise<{ success: boolean; message: string }>;
  sendOtp: (phone: string) => Promise<{ success: boolean; message: string; demoOtp?: string }>;
  verifyOtp: (phone: string, otp: string, name?: string) => Promise<{ success: boolean; message: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string; resetCode?: string }>;
  resetPassword: (email: string, resetCode: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  logoutAllSessions: () => Promise<void>;
  quickSwitchRole: (role: Role) => void;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_TOKEN_KEY = 'civicconnect_auth_token';
const LOCAL_STORAGE_USER_KEY = 'civicconnect_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeSessions, setActiveSessions] = useState<AuthSession[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Load session from server or localStorage on mount
  useEffect(() => {
    async function initSession() {
      const storedToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
      const storedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);

      if (storedToken && storedUser) {
        try {
          let parsedUser = JSON.parse(storedUser);
          if (parsedUser.name === 'Divya Prasad' || parsedUser.role === 'admin') {
            parsedUser.name = 'Anwith';
            parsedUser.email = 'anwithrenukunta9@gmail.com';
            parsedUser.role = 'citizen';
            parsedUser.avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80';
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(parsedUser));
          }
          setCurrentUser(parsedUser);
          setSessionToken(storedToken);

          // Verify with backend
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          if (res.ok) {
            const data = await res.json();
            if (data.user) {
              const u = data.user.name === 'Divya Prasad' ? { ...data.user, name: 'Anwith', role: 'citizen' } : data.user;
              setCurrentUser(u);
              localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(u));
            }
          }
        } catch (e) {
          console.warn('Session restoration fallback', e);
        }
      } else {
        // Default initialized session as Anwith (Citizen)
        const defaultCitizen: UserAccount = {
          id: 'USR-ANWITH',
          name: 'Anwith',
          email: 'anwithrenukunta9@gmail.com',
          phone: '+91 98450 11223',
          role: 'citizen',
          area: 'Indiranagar Central',
          ward: 'Ward 112 - Indiranagar',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
          points: 650,
          badges: ['Community Champion', 'Green Guardian', 'Top Reporter'],
          createdAt: '2026-01-10',
          lastLogin: 'Just now',
        };
        const defaultTok = 'tok-anwith-default-session';
        setCurrentUser(defaultCitizen);
        setSessionToken(defaultTok);
        localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, defaultTok);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(defaultCitizen));
      }
      setIsLoading(false);
    }

    initSession();
  }, []);

  // Fetch active sessions whenever user changes
  useEffect(() => {
    if (sessionToken) {
      fetch('/api/auth/sessions', {
        headers: { Authorization: `Bearer ${sessionToken}` },
      })
        .then((r) => r.json())
        .then((d) => {
          if (d.sessions) setActiveSessions(d.sessions);
        })
        .catch(() => {});
    }
  }, [sessionToken, currentUser]);

  const login = async (identifier: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();

      if (data.success && data.user && data.session) {
        setCurrentUser(data.user);
        setSessionToken(data.session.token);
        localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, data.session.token);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(data.user));
        setIsAuthModalOpen(false);
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Login failed.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error during login.' };
    }
  };

  const register = async (userData: any) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();

      if (data.success && data.user && data.session) {
        setCurrentUser(data.user);
        setSessionToken(data.session.token);
        localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, data.session.token);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(data.user));
        setIsAuthModalOpen(false);
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Registration failed.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error during registration.' };
    }
  };

  const sendOtp = async (phone: string) => {
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      return { success: data.success, message: data.message, demoOtp: data.demoOtp };
    } catch {
      return { success: true, message: 'OTP sent to mobile. Demo code: 482910', demoOtp: '482910' };
    }
  };

  const verifyOtp = async (phone: string, otp: string, name?: string) => {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, name }),
      });
      const data = await res.json();

      if (data.success && data.user && data.session) {
        setCurrentUser(data.user);
        setSessionToken(data.session.token);
        localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, data.session.token);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(data.user));
        setIsAuthModalOpen(false);
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Invalid OTP code.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error during OTP verification.' };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      return { success: data.success, message: data.message, resetCode: data.resetCode };
    } catch {
      return { success: true, message: 'Reset code sent: RESET-9921', resetCode: 'RESET-9921' };
    }
  };

  const resetPassword = async (email: string, resetCode: string, newPassword: string) => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resetCode, newPassword }),
      });
      const data = await res.json();
      return { success: data.success, message: data.message };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to reset password.' };
    }
  };

  const logout = async () => {
    if (sessionToken) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: sessionToken }),
      }).catch(() => {});
    }

    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    setSessionToken(null);
    setCurrentUser(null);
  };

  const logoutAllSessions = async () => {
    if (currentUser) {
      fetch('/api/auth/logout-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id }),
      }).catch(() => {});
    }

    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    setSessionToken(null);
    setCurrentUser(null);
  };

  const quickSwitchRole = (role: Role) => {
    if (role === 'guest') {
      logout();
      return;
    }

    const demoUsers: Record<Exclude<Role, 'guest'>, UserAccount> = {
      citizen: {
        id: 'USR-ANWITH',
        name: 'Anwith',
        email: 'anwithrenukunta9@gmail.com',
        phone: '+91 98450 11223',
        role: 'citizen',
        area: 'Indiranagar Central',
        ward: 'Ward 112 - Indiranagar',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        points: 650,
        badges: ['Community Champion', 'Green Guardian', 'Top Reporter'],
        createdAt: '2026-01-10',
        lastLogin: 'Just now',
      },
      worker: {
        id: 'USR-WORKER',
        name: 'Ramesh K. Gowda',
        email: 'worker@civicconnect.gov.in',
        phone: '+91 98450 12345',
        role: 'worker',
        area: 'Roads Division HQ',
        ward: 'Citywide Jurisdiction',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        department: 'Roads & Infrastructure Division',
        points: 620,
        badges: ['Master Fixer', 'Quick Responder'],
        createdAt: '2026-01-05',
        lastLogin: 'Just now',
      },
      volunteer: {
        id: 'USR-VOLUNTEER',
        name: 'Ananya Hegde',
        email: 'volunteer@example.com',
        phone: '+91 97412 33445',
        role: 'volunteer',
        area: 'Indiranagar HAL 2nd Stage',
        ward: 'Ward 112 - Indiranagar',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
        points: 480,
        badges: ['Community Champion', 'Green Guardian', 'Street Hero'],
        createdAt: '2026-03-01',
        lastLogin: 'Just now',
      },
    };

    const target = demoUsers[role as Exclude<Role, 'guest'>];
    if (target) {
      const tok = `tok-${role}-${Date.now()}`;
      setCurrentUser(target);
      setSessionToken(tok);
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, tok);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(target));
    }
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        sessionToken,
        isAuthenticated: Boolean(currentUser && sessionToken),
        isLoading,
        activeSessions,
        login,
        register,
        sendOtp,
        verifyOtp,
        forgotPassword,
        resetPassword,
        logout,
        logoutAllSessions,
        quickSwitchRole,
        openAuthModal,
        closeAuthModal,
        isAuthModalOpen,
        authModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
