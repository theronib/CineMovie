import { createContext, useContext, useState } from "react";
import {useNavigate} from "react-router-dom";
import { useCookies } from "react-cookie";

const AuthContext  = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("site") || "");
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(["jwt"]);
    const [role, setRole] = useState(localStorage.getItem("role") || "");
    const [user, setUser] = useState(localStorage.getItem("user") || "");

    const loginAction = async (data, onError) => {
        try {

            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ login: data.username, password: data.password })
            });
            const res = await response.json();
            if (res.token) {
                setToken(res.token);
                setCookie("jwt", res.token, { path: "/", httpOnly: false });
                localStorage.setItem("site", res.token);
                const response_profile = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/users/profile`, {
                    method: "GET",
                    credentials: "include",
                });

                const userData = await response_profile.json();
                localStorage.setItem("role", userData.state ? 'manager' : 'client');
                setRole(userData.state ? 'manager' : 'client');
                localStorage.setItem("user", JSON.stringify(userData));
                navigate(userData.state ? "/admin-page" : "/home");
                return;
            }
            throw new Error(res.message || "Authorization failed");
        } catch (err) {
            // console.error(err);
            if (onError) onError(err.message || "Authorization failed. Please try again later.");
        }
    };

    const logOut = async () => {
        await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/users/logout`, {
                method: "POST",
                "credentials": "include",
        });
        localStorage.removeItem("site");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        setToken(null);
        setRole(null);
        setUser(null);
        navigate("/login");
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ token: token, role: role, isAuthenticated: isAuthenticated,
            login: loginAction, logout: logOut, user: user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

