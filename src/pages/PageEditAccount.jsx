import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import { useAuth } from "../components/context/AuthContext";

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
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        nombre: user.displayName || ""
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

  const validarCampos = () => {
    const { nombre, apellido, telefono, fechaNacimiento, dni } = formData;

    if (!nombre || !apellido || !telefono || !fechaNacimiento) {
      return "Los campos obligatorios deben estar completos.";
    }

    if (dni && !/^\d{8}$/.test(dni)) {
      return "El DNI debe tener 8 dígitos numéricos.";
    }

    if (!/^\d{9}$/.test(telefono)) {
      return "El teléfono debe tener 9 dígitos numéricos.";
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
    <div className="min-h-screen w-full bg-gray-100 flex justify-center items-center px-4 py-10">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Editar Cuenta</h1>

        {message && (
          <div className="mb-4 px-4 py-2 rounded-lg text-sm text-white bg-black text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          <Input label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
          <Input label="Apellido" name="apellido" value={formData.apellido} onChange={handleChange} required />
          <Input label="DNI (opcional)" name="dni" value={formData.dni} onChange={handleChange} maxLength={8} />
          <Input label="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange} maxLength={9} required />
          <Input label="Fecha de nacimiento" name="fechaNacimiento" type="date" value={formData.fechaNacimiento} onChange={handleChange} required />
          <div>
            <label className="block mb-1 font-medium text-sm text-gray-700">Género (opcional)</label>
            <select name="genero" value={formData.genero} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl">
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </form>

        {/* Cambiar contraseña */}
        <div className="mt-10 border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Cambiar Contraseña</h2>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <Input
              label="Contraseña actual"
              name="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
            />
            <Input
              label="Nueva contraseña"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
            />
            <Input
              label="Confirmar nueva contraseña"
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
            />
            <button
              type="submit"
              className="w-full bg-gray-700 text-white py-3 rounded-xl hover:bg-gray-900 transition-colors font-semibold"
            >
              Cambiar Contraseña
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-gray-500 hover:text-black transition-colors"
          >
            ← Volver al inicio
          </button>
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
        className="w-full px-4 py-2 border border-gray-300 rounded-xl"
      />
    </div>
  );
}

export default PageEditAccount;