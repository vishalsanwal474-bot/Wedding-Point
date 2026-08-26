import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  fetchCurrentAdmin,
  loginAdmin,
  logoutAdmin,
} from '../services/authApi';
import {
  AUTH_EXPIRED_EVENT,
  getStoredToken,
  getStoredUser,
  storeAuthSession,
} from '../utils/authStorage';

const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  bootstrapping: true,
  login: async () => {},
  logout: () => {},
});

function normalizeUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id || user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => normalizeUser(getStoredUser()));
  const [token, setToken] = useState(() => getStoredToken());
  const [bootstrapping, setBootstrapping] = useState(true);

  const logout = useCallback(() => {
    logoutAdmin();
    setUser(null);
    setToken(null);
  }, []);

  const login = useCallback(async (credentials) => {
    const session = await loginAdmin(credentials);
    const nextUser = normalizeUser(session.user);
    setToken(session.token);
    setUser(nextUser);
    return nextUser;
  }, []);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      const storedToken = getStoredToken();

      if (!storedToken) {
        if (active) {
          setUser(null);
          setToken(null);
          setBootstrapping(false);
        }
        return;
      }

      try {
        const currentUser = await fetchCurrentAdmin();
        if (!active) {
          return;
        }

        const normalized = normalizeUser(currentUser);
        storeAuthSession({ token: storedToken, user: normalized });
        setToken(storedToken);
        setUser(normalized);
      } catch (_error) {
        if (!active) {
          return;
        }
        logoutAdmin();
        setUser(null);
        setToken(null);
      } finally {
        if (active) {
          setBootstrapping(false);
        }
      }
    }

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const onExpired = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      bootstrapping,
      login,
      logout,
    }),
    [user, token, bootstrapping, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
