import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Configure axios defaults for all requests
axios.defaults.withCredentials = true;

// Add interceptor to include token in all requests
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const storedUser = localStorage.getItem("user");
                const storedToken = localStorage.getItem("accessToken");
                if (storedUser && storedToken) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error("Auth check failed", error);
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, []);

    const login = async (userData, accessToken) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        if (accessToken) {
            localStorage.setItem("accessToken", accessToken);
        }
    };

    const logout = async () => {
        try {
            await axios.post("http://localhost:8000/api/v1/users/logout", {}, { withCredentials: true });
        } catch (error) {
            console.error("Logout error:", error);
        }
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
    };

    const value = {
        user,
        loading,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
