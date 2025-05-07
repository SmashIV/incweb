import ImagFormulaLog from "../../assets/ImagFormularioLogin.webp";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function FormularioLogin (){
    const [showRegister, setShowRegister] = useState(false);

    return (
        <section>
            <div className="flex flex-col md:flex-row w-full h-screen">
                <div className="md:w-2/5 flex justify-center items-center p-8 bg-gray-100">
                    <AnimatePresence mode="wait">
                        {!showRegister ? (
                            <motion.form
                                key="login"
                                method="post"
                                className="w-full max-w-md space-y-4"
                                initial={{ x: 0, opacity: 1 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -100, opacity: 0 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                            >
                                <h2 className="text-3xl font-bold text-center text-gray-900">Inicia sesión</h2>
                                <div>
                                    <label htmlFor="correo" className="block text-gray-800 font-semibold mb-1">Usuario:</label>
                                    <input type="email" name="correo" id="correo" placeholder="Correo electrónico" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
                                </div>
                                <div>
                                    <label htmlFor="contraseña" className="block text-gray-800 font-semibold mb-1">Contraseña:</label>
                                    <input type="password" name="contraseña" placeholder="Contraseña" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
                                </div>
                                <p>¿Has olvidado su contraseña?</p>
                                <button type="submit" className="w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors">Iniciar sesión</button>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="register"
                                method="post"
                                className="w-full max-w-md space-y-4"
                                initial={{ x: 100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 100, opacity: 0 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                            >
                                <h2 className="text-3xl font-bold text-center text-gray-900">Registro</h2>
                                <div>
                                    <label htmlFor="nombre" className="block text-gray-800 font-semibold mb-1">Nombre:</label>
                                    <input type="text" name="nombre" id="nombre" placeholder="Tu nombre" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
                                </div>
                                <div>
                                    <label htmlFor="correo_reg" className="block text-gray-800 font-semibold mb-1">Correo electrónico:</label>
                                    <input type="email" name="correo_reg" id="correo_reg" placeholder="Correo electrónico" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
                                </div>
                                <div>
                                    <label htmlFor="password_reg" className="block text-gray-800 font-semibold mb-1">Contraseña:</label>
                                    <input type="password" name="password_reg" id="password_reg" placeholder="Contraseña" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
                                </div>
                                <div>
                                    <label htmlFor="password2_reg" className="block text-gray-800 font-semibold mb-1">Repetir contraseña:</label>
                                    <input type="password" name="password2_reg" id="password2_reg" placeholder="Repite tu contraseña" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
                                </div>
                                <button type="submit" className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors">Registrarse</button>
                                <button type="button" className="w-full text-gray-600 underline mt-2" onClick={()=>setShowRegister(false)}>Volver a iniciar sesión</button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>

                <div className="md:w-3/5 relative flex items-center justify-center">
                    <img src={ImagFormulaLog} alt="Fondo de login" className="w-full h-full object-cover"/>
                    <div className="absolute z-10 text-center px-4 py-8 backdrop-blur-xs">
                        {showRegister ? (
                            <>
                                <h2 className="text-3xl font-bold text-white mb-4 drop-shadow">¿Ya tienes cuenta?</h2>
                                <p className="text-sm text-white leading-relaxed drop-shadow-md max-w-md">
                                    Inicia sesión para acceder a tu cuenta y disfrutar de todos los beneficios exclusivos para miembros.
                                </p>
                                <button type="button" onClick={()=>setShowRegister(false)} className="w-full bg-white text-black font-semibold py-2 rounded-lg hover:bg-gray-300 transition-colors mt-4">Iniciar sesión</button>
                            </>
                        ) : (
                            <>
                                <h2 className="text-3xl font-bold text-white mb-4 drop-shadow">Nuevo Cliente</h2>
                                <p className="text-sm text-white leading-relaxed drop-shadow-md max-w-md">
                                    Regístrate para obtener acceso anticipado a la venta, además de nuevas llegadas, tendencias y promociones personalizadas. 
                                    Para darse de baja, haga clic en cancelar la suscripción en nuestros correos electrónicos.
                                </p>
                                <button type="button" onClick={()=>setShowRegister(true)} className="w-full bg-white text-black font-semibold py-2 rounded-lg hover:bg-gray-300 transition-colors mt-4">Registrar</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
export default FormularioLogin; 