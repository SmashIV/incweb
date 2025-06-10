import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import { useAuth } from "../components/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, User, Mail, Phone, Calendar, CreditCard, Shield, ArrowLeft, ShoppingBag, Heart, Star, Info, AlertCircle } from "lucide-react";

function MathPatternBackground() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawPattern = () => {
      const width = canvas.width;
      const height = canvas.height;
      const time = timeRef.current;
      
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.lineWidth = 1;

      const centerX = width / 2;
      const centerY = height / 2;

      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
          const wave = Math.sin(x * 0.01 + time) * 10 + Math.cos(y * 0.01 + time) * 10;
          ctx.beginPath();
          ctx.arc(x + wave, y + wave, 1, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      for (let i = 0; i < 5; i++) {
        const radius = 100 + i * 60;
        const rotation = time * 0.2 + i * 0.5;
        ctx.beginPath();
        ctx.arc(
          centerX + Math.cos(rotation) * 50,
          centerY + Math.sin(rotation) * 50,
          radius,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }

      for (let i = 0; i < 20; i++) {
        const angle = (i * Math.PI * 2) / 20 + time * 0.3;
        const length = 150 + Math.sin(time * 2 + i) * 30;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + length * Math.cos(angle),
          centerY + length * Math.sin(angle)
        );
        ctx.stroke();
      }

      for (let i = 0; i < 100; i++) {
        const angle = i * 0.1 + time * 0.5;
        const radius = i * 3;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        if (i === 0) {
          ctx.beginPath();
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      for (let i = 0; i < 50; i++) {
        const angle = (i * Math.PI * 2) / 50 + time;
        const radius = 200 + Math.sin(time * 3 + i) * 50;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.stroke();
      }

      timeRef.current += 0.01;
      animationRef.current = requestAnimationFrame(drawPattern);
    };

    drawPattern();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ 
        pointerEvents: 'none',
        zIndex: 0
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  );
}

function PageEditAccount() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    fechaNacimiento: "",
    genero: "masculino",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        nombre: user.displayName || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validarCampos = () => {
    const { nombre, apellido, telefono, fechaNacimiento, dni, direccion, ciudad, codigoPostal } = formData;

    if (!nombre || !apellido || !telefono || !fechaNacimiento) {
      return "Los campos obligatorios deben estar completos.";
    }

    if (dni && !/^\d{8}$/.test(dni)) {
      return "El DNI debe tener 8 dígitos numéricos.";
    }

    if (!/^\d{9}$/.test(telefono)) {
      return "El teléfono debe tener 9 dígitos numéricos.";
    }

    if (codigoPostal && !/^\d{5}$/.test(codigoPostal)) {
      return "El código postal debe tener 5 dígitos.";
    }

    const fecha = new Date(fechaNacimiento);
    const hoy = new Date();

    if (fecha > hoy) {
      return "La fecha de nacimiento no puede ser en el futuro.";
    }

    const edad = hoy.getFullYear() - fecha.getFullYear();
    const mes = hoy.getMonth() - fecha.getMonth();
    const dia = hoy.getDate() - fecha.getDate();

    const esMenor = edad < 18 || (edad === 18 && (mes < 0 || (mes === 0 && dia < 0)));

    if (esMenor) {
      return "Debes tener al menos 18 años.";
    }

    return null;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const error = validarCampos();
    if (error) {
      setMessage(error);
      setLoading(false);
      return;
    }

    try {
      setUser({ ...user, displayName: formData.nombre });
      setMessage("Perfil actualizado correctamente.");
    } catch (error) {
      setMessage("Error al actualizar perfil: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("Todos los campos de contraseña son obligatorios.");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Las nuevas contraseñas no coinciden.");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setMessage("Contraseña actualizada correctamente.");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setMessage("Error al cambiar la contraseña: " + error.message);
    }
  };

  return (
    <div className="min-h-screen w-full relative bg-gray-50">
      <div className="relative w-full h-full">
        <MathPatternBackground />
        
        <div className="bg-black text-white py-6 px-8 relative z-10">
          <div className="max-w-[1920px] mx-auto">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Mi Cuenta</h1>
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft size={16} />
                Volver al inicio
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-[1920px] mx-auto px-8 py-8 relative z-10">
          <div className="grid grid-cols-12 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="col-span-12 lg:col-span-3 space-y-8"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Resumen de Cuenta</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <ShoppingBag className="text-gray-600" size={24} />
                    <div>
                      <p className="text-base text-gray-600">Pedidos Activos</p>
                      <p className="text-xl font-semibold text-gray-800">3</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <Heart className="text-gray-600" size={24} />
                    <div>
                      <p className="text-base text-gray-600">Favoritos</p>
                      <p className="text-xl font-semibold text-gray-800">12</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <Star className="text-gray-600" size={24} />
                    <div>
                      <p className="text-base text-gray-600">Puntos de Fidelidad</p>
                      <p className="text-xl font-semibold text-gray-800">1,250</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Próximos Eventos</h3>
                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-base font-medium text-gray-800">Venta Especial</p>
                    <p className="text-sm text-gray-600">15% de descuento en toda la tienda</p>
                    <p className="text-sm text-gray-500 mt-2">Válido hasta: 30/04/2024</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-base font-medium text-gray-800">Nueva Colección</p>
                    <p className="text-sm text-gray-600">Lanzamiento Primavera 2024</p>
                    <p className="text-sm text-gray-500 mt-2">Disponible: 01/05/2024</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="col-span-12 lg:col-span-6">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-10 space-y-12">
                  <AnimatePresence mode="wait">
                    {message && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="px-4 py-2 rounded-lg text-sm text-white bg-black text-center"
                      >
                        {message}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
                      <User size={24} className="text-gray-700" />
                      <h2 className="text-xl font-semibold text-gray-800">Información Personal</h2>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Input label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
                        <Input label="Apellido" name="apellido" value={formData.apellido} onChange={handleChange} required />
                        <Input label="DNI (opcional)" name="dni" value={formData.dni} onChange={handleChange} maxLength={8} />
                        <Input label="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange} maxLength={9} required />
                        <Input label="Fecha de nacimiento" name="fechaNacimiento" type="date" value={formData.fechaNacimiento} onChange={handleChange} required />
                        <div>
                          <label className="block mb-1 font-medium text-sm text-gray-700">Género (opcional)</label>
                          <select name="genero" value={formData.genero} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all">
                            <option value="masculino">Masculino</option>
                            <option value="femenino">Femenino</option>
                            <option value="otro">Otro</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? "Guardando..." : "Guardar Cambios"}
                        </button>
                      </div>
                    </form>
                  </motion.section>

                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
                      <Shield size={24} className="text-gray-700" />
                      <h2 className="text-xl font-semibold text-gray-800">Seguridad</h2>
                    </div>

                    <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-2xl">
                      <PasswordInput
                        label="Contraseña actual"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        showPassword={showPassword.current}
                        onToggle={() => togglePasswordVisibility("current")}
                      />
                      <PasswordInput
                        label="Nueva contraseña"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        showPassword={showPassword.new}
                        onToggle={() => togglePasswordVisibility("new")}
                      />
                      <PasswordInput
                        label="Confirmar nueva contraseña"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        showPassword={showPassword.confirm}
                        onToggle={() => togglePasswordVisibility("confirm")}
                      />
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold"
                        >
                          Cambiar Contraseña
                        </button>
                      </div>
                    </form>
                  </motion.section>

                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
                      <CreditCard size={24} className="text-gray-700" />
                      <h2 className="text-xl font-semibold text-gray-800">Dirección</h2>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Input label="Dirección" name="direccion" value={formData.direccion} onChange={handleChange} />
                        <Input label="Ciudad" name="ciudad" value={formData.ciudad} onChange={handleChange} />
                        <Input label="Código Postal" name="codigoPostal" value={formData.codigoPostal} onChange={handleChange} maxLength={5} />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold"
                        >
                          Guardar Dirección
                        </button>
                      </div>
                    </form>
                  </motion.section>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="col-span-12 lg:col-span-3 space-y-8"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Consejos de Seguridad</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Shield className="text-gray-600 mt-1" size={24} />
                    <p className="text-base text-gray-600">Cambia tu contraseña regularmente y usa una combinación de letras, números y símbolos.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <AlertCircle className="text-gray-600 mt-1" size={24} />
                    <p className="text-base text-gray-600">Nunca compartas tus credenciales de acceso con terceros.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <Info className="text-gray-600 mt-1" size={24} />
                    <p className="text-base text-gray-600">Mantén actualizada tu información de contacto para recibir notificaciones importantes.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Soporte</h3>
                <div className="space-y-6">
                  <div className="p-6 bg-gray-50 rounded-xl">
                    <p className="text-base font-medium text-gray-800">¿Necesitas ayuda?</p>
                    <p className="text-sm text-gray-600 mt-2">Nuestro equipo de soporte está disponible de lunes a viernes de 9:00 a 18:00.</p>
                    <button className="mt-4 text-base text-black font-medium hover:underline">
                      Contactar Soporte →
                    </button>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-xl">
                    <p className="text-base font-medium text-gray-800">FAQ</p>
                    <p className="text-sm text-gray-600 mt-2">Encuentra respuestas a las preguntas más frecuentes sobre tu cuenta.</p>
                    <button className="mt-4 text-base text-black font-medium hover:underline">
                      Ver FAQ →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, name, type = "text", value, onChange, maxLength, required }) {
  return (
    <div>
      <label className="block mb-1 font-medium text-sm text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        required={required}
        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
      />
    </div>
  );
}

function PasswordInput({ label, name, value, onChange, showPassword, onToggle }) {
  return (
    <div>
      <label className="block mb-1 font-medium text-sm text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all pr-10"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

export default PageEditAccount;