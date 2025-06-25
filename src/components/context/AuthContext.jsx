import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "../../config/firebase";
import { signInWithPopup, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const idToken = await firebaseUser.getIdToken();
                    if (idToken) {
                        localStorage.setItem('token', idToken);
                        const response = await axios.get(
                            `http://localhost:3000/auth/get_user_role/${firebaseUser.uid}`,
                            {
                                headers: {
                                    'Authorization': `Bearer ${idToken}`,
                                    'Content-Type': 'application/json'
                                }
                            }
                        );
                        setUser({
                            ...firebaseUser,
                            rol: response.data.rol
                        });
                    } else {
                        await signOut(auth);
                        localStorage.removeItem('token');
                        setUser(null);
                    }
                } catch (error) {
                    console.error('Error getting token:', error);
                    await signOut(auth);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            } else {
                localStorage.removeItem('token');
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
    };

    const register = async (email, password) => {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            return userCredential.user;
    };

    const loginWithGoogle = async () => {
            const userCredential = await signInWithPopup(auth, googleProvider);
            return userCredential.user;
    };

    const logout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('token');
            setUser(null);
        } catch (error) {    
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

