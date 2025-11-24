"use client";
import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

// Robust default context to prevent crashes
const AuthContext = createContext({
    user: null,
    login: async () => { console.warn("AuthContext: login called without provider"); },
    logout: async () => { console.warn("AuthContext: logout called without provider"); },
    loading: true
});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Safety check if Firebase isn't initialized
        if (!auth) {
            console.error("Firebase Auth not initialized");
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser({
                    uid: currentUser.uid,
                    email: currentUser.email,
                    displayName: currentUser.displayName,
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Wrap in useCallback to keep reference stable
    const login = useCallback(async (email, password) => {
        if (!auth) throw new Error("Auth not initialized");
        return await signInWithEmailAndPassword(auth, email, password);
    }, []);

    const logout = useCallback(async () => {
        if (!auth) throw new Error("Auth not initialized");
        setUser(null);
        return await signOut(auth);
    }, []);

    const value = useMemo(() => ({
        user,
        login,
        logout,
        loading
    }), [user, login, logout, loading]);

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="h-screen w-screen flex items-center justify-center bg-[#0f1923] text-white font-bold">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-8 h-8 border-4 border-[#ff4655] border-t-transparent rounded-full animate-spin"></div>
                        <span>Initializing Protocol...</span>
                    </div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};