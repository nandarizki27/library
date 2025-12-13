import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api"; // Panggil variabel lokal 'authAPI'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [loading, setLoading] = useState(true);

  // Load user data saat pertama kali buka website
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      authAPI
        .getUser()
        .then((res) => {
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // REGISTER
  const register = async (name, email, password, passwordConfirmation) => {
    // PENTING: Mengubah nama field 'passwordConfirmation' (camelCase) 
    // menjadi 'password_confirmation' (snake_case) agar sesuai dengan aturan validasi Laravel.
    const response = await authAPI.register({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation, // <-- PERBAIKAN UTAMA
    });

    const token = response.data.token || response.data.access_token;
    const userData = response.data.user;

    if (!token) {
      throw new Error("Registration response does not contain a token");
    }

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    return response.data;
  };

  // LOGIN
  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });

    const token = response.data.token || response.data.access_token;
    const userData = response.data.user;

    if (!token) {
      throw new Error("Login response does not contain a token");
    }

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    return response.data;
  };

  // LOGOUT
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.log("Logout error ignored:", err);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);

    window.location.href = "/login";
  };

  return (
    // PENTING: Pastikan fungsi register juga diekspor di sini
    <AuthContext.Provider value={{ user, login, logout, register, loading }}> 
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);