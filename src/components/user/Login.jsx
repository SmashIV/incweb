import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import llamaGif from "../../assets/gifs/llama.gif";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "firebase/auth";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import { auth } from "../config/firebase";

function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login, register, loginWithGoogle } = useAuth();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [showCaptcha, setShowCaptcha] = useState(false);
    const [captchaToken, setCaptchaToken] = useState(null);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
                const user = auth.currentUser;
                if (user) {
                    const idToken = await user.getIdToken();
                    localStorage.setItem('token', idToken);
                }
                navigate("/");
            } else {
                setShowCaptcha(true);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }

    };

    const handleCaptchaContinue = () => {
        setShowPasswordForm(true);
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            if (password != confirmPassword) {
                throw new Error("Las contrasenas no coinciden");
            }
            const user = await register(email, password);
            await updateProfile(user ?? auth.currentUser, {
                displayName: `${firstName} ${lastName}`
            });

            const idToken = await (user ?? auth.currentUser).getIdToken();
            localStorage.setItem('token', idToken);

            try {
                await axios.post(
                    "http://localhost:3000/auth/register",
                    {
                        firebase_uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        rol: 'usuario'
                    },
                    {
                        headers: {
                            "Authorization": `Bearer ${idToken}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
            } catch (error) {
                if (error.response) {
                    console.error(error.response.data);
                } else {
                    console.error(error.message)
                }
            }

            navigate("/");
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false);
        }
    };


    let isUserExists = async (idToken, uid) => {
        try {
            const res = await axios.get(
                `http://localhost:3000/auth/exists/${uid}`,
                {
                    headers: {
                        "Authorization": `Bearer ${idToken}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            return res.data.exists;
        } catch (error) {
            // solo para debugs
            /*if (error.response) {
                console.log("sc:", error.response.status);
                console.log("body: ", error.response.data);
            } else if (error.request) {
                console.log("No hubo respuesta ", error.request);
            } else {
                console.log("Error: ", error.message);
            }*/
            setError("Ha fallado en el exists"); //solo debug, despues esto se elimina
            return false;
        }
    };


    const handleGoogleAuth = async () => {
        setError("");
        setLoading(true);
        try {
            const user = await loginWithGoogle();
            const currentUser = user ?? auth.currentUser;
            const idToken = await currentUser.getIdToken();
            localStorage.setItem('token', idToken);
            console.log(currentUser.uid);
            let exists = false;
            try {
                exists = await isUserExists(idToken, currentUser.uid);
                console.log(exists);
            } catch (error) {
                exists = false;
            }
            if (!exists) {
                try {
                    await axios.post(
                        "http://localhost:3000/auth/register",
                        {
                            firebase_uid: currentUser.uid,
                            email: currentUser.email,
                            displayName: currentUser.displayName,
                            rol: 'usuario'
                        },
                        {
                            headers: {
                                "Authorization": `Bearer ${idToken}`,
                                "Content-Type": "application/json"
                            }
                        }
                    );
                }catch (error) {
                    if (error.response) {
                        console.error(error.response.data);
                    } else {
                        console.error(error.message);
                    }
                    setError("Ha fallado en el exists");
                    return false;
                }
            }
            navigate("/");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-white flex flex-col items-center pt-16 px-4">
            <div className="w-full max-w-md flex flex-col items-center">
                <div className="w-32 h-32 mb-8 flex flex-col items-center">
                    <img src={llamaGif} alt="Llama Animation" className="w-full h-full object-contain" />
                    <h1 className="text-2xl font-extrabold text-gray-800 mt-2 tracking-wide text-center">Incalpaca</h1>
                </div>

                {error && (
                    <div className="w-full bg-red-200 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <div className="w-full">
                    {showPasswordForm ? (
                        <form onSubmit={handlePasswordSubmit} className="space-y-6 w-full animate-fade-in">
                            <div className="space-y-4">
                                <div>
                                    <input
                                        type="password"
                                        autoComplete="off"
                                        placeholder="Contrasena"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        autoComplete="off"
                                        placeholder="Confirmar Contrasena"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 hover:cursor-pointer transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Cargando ..." : "Registrarse"}
                            </button>
                        </form>
                    ) : showCaptcha ? (

                        <div className="flex flex-col items-center justify-center min-h-[300px]">
                            <ReCAPTCHA
                                sitekey="6Lf0hDQrAAAAADAhpyY7f9JsLMeHKDjiarW1C9EH"
                                onChange={token => setCaptchaToken(token)}
                            />
                            <button
                                className="mt-6 px-6 py-2 bg-black text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!captchaToken}
                                onClick={handleCaptchaContinue}
                            >
                                Continuar registro
                            </button>
                        </div>

                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.form
                                key={isLogin ? "login" : "register"}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6 w-full"
                                onSubmit={handleSubmit}
                            >
                                <div className="space-y-4">
                                    {!isLogin && (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Nombre"
                                                value={firstName}
                                                onChange={e => setFirstName(e.target.value)}
                                                required
                                                className="w-1/2 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Apellido"
                                                value={lastName}
                                                onChange={e => setLastName(e.target.value)}
                                                required
                                                className="w-1/2 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <input
                                            type="email"
                                            placeholder="Correo Electronico"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                                        />
                                    </div>

                                    {isLogin && (
                                        <div>
                                            <input
                                                type="password"
                                                autoComplete="off"
                                                placeholder="Contraseña"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                                            />
                                        </div>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 hover:cursor-pointer transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Cargando ...." : isLogin ? "Iniciar Sesion" : "Continuar"}
                                </button>
                                <div className="relative mt-2">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">O</span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleGoogleAuth}
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors font-semibold hover:cursor-pointer mt-2"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M21.805 10.023h-9.82v3.955h5.627c-.243 1.3-1.47 3.82-5.627 3.82-3.38 0-6.14-2.8-6.14-6.26s2.76-6.26 6.14-6.26c1.93 0 3.23.82 3.97 1.53l2.71-2.63C17.09 2.61 14.97 1.5 12.5 1.5 6.98 1.5 2.5 5.98 2.5 11.5s4.48 10 10 10c5.77 0 9.57-4.05 9.57-9.75 0-.65-.07-1.15-.16-1.73z" />
                                    </svg>
                                    Continuar con Google
                                </button>
                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => setIsLogin(!isLogin)}
                                        className="text-sm text-gray-600 hover:text-black transition-colors"
                                    >
                                        {isLogin ? "No tienes cuenta? Registrate" : "Ya tienes cuenta? Inicia sesion"}
                                    </button>
                                </div>
                            </motion.form>
                        </AnimatePresence>
                    )}
                    <Link
                        to="/"
                        className="inline-block text-sm text-gray-500 hover:text-black transition-colors mt-4"
                    >
                        ← Volver a la tienda
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;