import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "../../config/firebase";
import { signInWithPopup, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { dataTagErrorSymbol } from "@tanstack/react-query";

const AuthContext = createContext();

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        //handle the auth state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        })

        return () => unsubscribe();

    }, [])

    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    };

    const register = async (email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        }catch (error) {
            throw error;
        }
    };


    const loginWithGoogle = async () => {
        try {
            const userCredential = await signInWithPopup(auth, googleProvider);
            return userCredential.user;
        } catch (error) {
            // console.log("error ---> ", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        }catch (error) {    
            throw error;
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        loginWithGoogle,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

