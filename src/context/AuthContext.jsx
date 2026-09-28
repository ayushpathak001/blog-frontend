import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authApi, storage } from '../services/api';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(storage.getToken());
  const [user, setUser] = useState(storage.getUser());
  const [sessionMessage, setSessionMessage] = useState('');

  const login = async (name, password, remember) => {
    const { access_token } = await authApi.login({ name, password });
    // No /me endpoint exists, so the known identity is the name used to sign in.
    const u = { name };
    storage.save(access_token, u, remember);
    setToken(access_token); setUser(u); setSessionMessage('');
  };
  const logout = useCallback((message = '') => {
    storage.clear(); setToken(null); setUser(null); setSessionMessage(message);
  }, []);

  useEffect(() => {
    const h = () => logout('Your session has expired. Please log in again.');
    window.addEventListener('api:unauthorized', h);
    return () => window.removeEventListener('api:unauthorized', h);
  }, [logout]);

  return (
    <Ctx.Provider value={{ token, user, isAuthenticated: !!token, login, logout, sessionMessage, clearSessionMessage: () => setSessionMessage('') }}>
      {children}
    </Ctx.Provider>
  );
}
