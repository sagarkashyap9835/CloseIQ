import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem("closeiq_user");
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    // Save user to localStorage whenever it changes
    const saveUser = (userData) => {
        localStorage.setItem("closeiq_user", JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
    };

    // Register new user
    const register = (userData) => {
        const newUser = {
            id: Date.now().toString(),
            phone: userData.phone,
            name: userData.name || "",
            email: userData.email || "",
            street: "",
            pincode: "",
            state: "",
            country: "India",
            gender: "",
            location: "",
            profileImage: null,
            createdAt: new Date().toISOString(),
        };
        saveUser(newUser);
        return newUser;
    };

    // Login existing user
    const login = (phone) => {
        const savedUsers = JSON.parse(localStorage.getItem("closeiq_all_users") || "[]");
        const existingUser = savedUsers.find((u) => u.phone === phone);

        if (existingUser) {
            saveUser(existingUser);
            return existingUser;
        }
        return null;
    };

    // Update user profile
    const updateProfile = (updates) => {
        if (!user) return null;

        const updatedUser = { ...user, ...updates, updatedAt: new Date().toISOString() };
        saveUser(updatedUser);

        // Also update in all users list
        const savedUsers = JSON.parse(localStorage.getItem("closeiq_all_users") || "[]");
        const userIndex = savedUsers.findIndex((u) => u.phone === user.phone);
        if (userIndex >= 0) {
            savedUsers[userIndex] = updatedUser;
        } else {
            savedUsers.push(updatedUser);
        }
        localStorage.setItem("closeiq_all_users", JSON.stringify(savedUsers));

        return updatedUser;
    };

    // Logout
    const logout = () => {
        // Save current user to all users before logging out
        if (user) {
            const savedUsers = JSON.parse(localStorage.getItem("closeiq_all_users") || "[]");
            const userIndex = savedUsers.findIndex((u) => u.phone === user.phone);
            if (userIndex >= 0) {
                savedUsers[userIndex] = user;
            } else {
                savedUsers.push(user);
            }
            localStorage.setItem("closeiq_all_users", JSON.stringify(savedUsers));
        }

        localStorage.removeItem("closeiq_user");
        setUser(null);
        setIsAuthenticated(false);
    };

    // Check if phone exists (for login vs register flow)
    const checkPhoneExists = (phone) => {
        const savedUsers = JSON.parse(localStorage.getItem("closeiq_all_users") || "[]");
        return savedUsers.some((u) => u.phone === phone);
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        register,
        login,
        logout,
        updateProfile,
        checkPhoneExists,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
