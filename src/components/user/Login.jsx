import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import llamaGif from "../../assets/gifs/llama.gif";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login, register, loginWithGoogle } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {

                if (password != confirmPassword) {
                    throw new Error("Las contrasenas no coinciden");
                }
                await register(email, password);
            } 
            navigate("/");
        }catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }

    };

    const handleGoogleSignIn = async () => {
        try {
            setError("");
            setLoading(true);

            await loginWithGoogle();
            navigate("/");

        }catch(error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }

    };



    return (
        <div className="min-h-screen w-full bg-white flex flex-col items-center pt-16 px-4">
            <div className="w-full max-w-md flex flex-col items-center">
                <div className="w-32 h-32 mb-8">
                    <img src={llamaGif} alt="Llama Animation" className="w-full h-full object-contain" />
                </div>

                {error && (
                    <div className="w-full bg-red-200 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {/* Contenedor de formularios con AnimatePresence */}
                <div className="w-full">
                    <AnimatePresence mode="wait">
                        <motion.form
                            key={isLogin ? "login" : "register"}
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -20}}
                            transition={{duration: 0.3}}
                            className="space-y-6 w-full"
                            onSubmit={handleSubmit}
                        >
                            <button
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M21.805 10.023h-9.82v3.955h5.627c-.243 1.3-1.47 3.82-5.627 3.82-3.38 0-6.14-2.8-6.14-6.26s2.76-6.26 6.14-6.26c1.93 0 3.23.82 3.97 1.53l2.71-2.63C17.09 2.61 14.97 1.5 12.5 1.5 6.98 1.5 2.5 5.98 2.5 11.5s4.48 10 10 10c5.77 0 9.57-4.05 9.57-9.75 0-.65-.07-1.15-.16-1.73z"/>
                                </svg>
                                Continuar con Google
                            </button>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">O</span>
                                </div>
                            </div>
                            <div className="space-y-4">
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
                                <div>
                                    <input 
                                        type="password" 
                                        placeholder="Contraseña"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                                    />
                                </div>
                                { !isLogin && (
                                    <div>
                                        <input 
                                        type="password" 
                                        placeholder="Confirmar Contraseña"
                                        value={password}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                                    />
                                    </div>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Cargando ...." : isLogin ? "Iniciar Sesion" : "Registrarse"}
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
                        <Link 
                            to="/" 
                            className="inline-block text-sm text-gray-500 hover:text-black transition-colors"
                        >
                            ← Volver a la tienda
                        </Link>
                    </div>
                </div>
            </div>
    );
}

export default Login;