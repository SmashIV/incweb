import React, { useState, useEffect, useMemo } from 'react';
import { Users as UsersIcon, UserPlus, Mail, Phone, Calendar, Shield, Search, Filter, Terminal, Code, Server, Database, Eye, EyeOff, MapPin, CreditCard, ShoppingBag, X, Edit, Trash2, Grid, List, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { createUserWithEmailAndPassword, updateProfile, updateEmail, sendEmailVerification } from 'firebase/auth';
import { auth } from '../../config/firebase';
import Papa from 'papaparse';

const AddUserModal = ({ isOpen, onClose, onSubmit, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState('');
  
  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    rol: 'usuario'
  });

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, authData.email, authData.password);
      const firebase_uid = userCredential.user.uid;
      const idToken = await userCredential.user.getIdToken();

      await axios.post(
        'http://localhost:3000/auth/register',
        {
          firebase_uid,
          email: authData.email,
          rol: authData.rol
        },
        {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setAuthData({
        email: '',
        password: '',
        rol: 'usuario'
      });
      setSuccess('Usuario creado exitosamente. Ahora puedes editar sus datos personales y direcciones.');
      onUpdate();
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('El correo electrónico ya está en uso');
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[20rem] font-serif text-gray-100 select-none">IV</span>
            </div>
            <div className="relative z-10 p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-serif font-light text-gray-800">
                  Agregar Usuario
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} className="text-gray-500" />
                </button>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-600 mb-2">
                    <AlertTriangle size={20} />
                    <span className="font-medium">Error</span>
                  </div>
                  <div className="text-sm text-red-600">
                    {error}
                  </div>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-600 mb-2">
                    <CheckCircle size={20} />
                    <span className="font-medium">Éxito</span>
                  </div>
                  <div className="text-sm text-green-600 mb-4">
                    {success}
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-green-600 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-8">
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-serif font-light text-gray-800 mb-4">Datos de Acceso</h3>
                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-light text-gray-500 mb-1">Email</label>
                      <input
                        type="email"
                        required
                        className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                        value={authData.email}
                        onChange={(e) => setAuthData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-light text-gray-500 mb-1">Contraseña</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                          value={authData.password}
                          onChange={(e) => setAuthData(prev => ({ ...prev, password: e.target.value }))}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-light text-gray-500 mb-1">Rol</label>
                      <select
                        required
                        className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                        value={authData.rol}
                        onChange={(e) => setAuthData(prev => ({ ...prev, rol: e.target.value }))}
                      >
                        <option value="usuario">Usuario</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "Guardando..." : "Guardar Credenciales"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const EditUserModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [ubigeos, setUbigeos] = useState([]);
  const [departamento, setDepartamento] = useState('');
  const [provincia, setProvincia] = useState('');
  const [distrito, setDistrito] = useState('');
  const [provinciasFiltradas, setProvinciasFiltradas] = useState([]);
  const [distritosFiltrados, setDistritosFiltrados] = useState([]);
  const [hasPersonalData, setHasPersonalData] = useState(false);
  
  const [userData, setUserData] = useState({
    email: '',
    rol: '',
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    fecha_nacimiento: '',
    genero: ''
  });

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    titulo: '',
    direccion: '',
    departamento: '',
    provincia: '',
    distrito: '',
    referencia: '',
    codigo_postal: '',
    es_principal: false
  });

  const [isDeleteAddressModalOpen, setIsDeleteAddressModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [deletingAddressId, setDeletingAddressId] = useState(null);

  const showMessage = (message, type = 'success') => {
    if (type === 'success') {
      setSuccess(message);
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const resetFormFields = () => {
    setSelectedAddress(null);
    setNewAddress({
      titulo: '',
      direccion: '',
      departamento: '',
      provincia: '',
      distrito: '',
      referencia: '',
      codigo_postal: '',
      es_principal: false
    });
    setDepartamento('');
    setProvincia('');
    setDistrito('');
    setProvinciasFiltradas([]);
    setDistritosFiltrados([]);
    setError('');
    setSuccess('');
  };

  useEffect(() => {
    if (isOpen && user) {
      fetchUserData();
      fetchUserAddresses();
      resetFormFields();
    }
  }, [isOpen, user]);

  useEffect(() => {
    Papa.parse('/src/constants/ubicaciones/UBIGEOS_2022_1891_distritos.csv', {
      download: true,
      header: true,
      delimiter: ";",
      complete: (result) => {
        setUbigeos(result.data.filter(row => row.NOMBDEP && row.NOMBPROV && row.NOMBDIST));
      }
    });
  }, []);

  useEffect(() => {
    if (departamento) {
      const provs = Array.from(new Set(ubigeos.filter(u => u.NOMBDEP === departamento).map(u => u.NOMBPROV)));
      setProvinciasFiltradas(provs);
      setProvincia('');
      setDistrito('');
      setDistritosFiltrados([]);
    }
  }, [departamento, ubigeos]);

  useEffect(() => {
    if (departamento && provincia) {
      const dists = Array.from(new Set(ubigeos.filter(u => u.NOMBDEP === departamento && u.NOMBPROV === provincia).map(u => u.NOMBDIST)));
      setDistritosFiltrados(dists);
      setDistrito('');
    }
  }, [provincia, departamento, ubigeos]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/admin/get_user_data/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.data) {
        setUserData({
          email: response.data.email || '',
          rol: response.data.rol || '',
          nombre: response.data.nombre || '',
          apellido: response.data.apellido || '',
          dni: response.data.dni || '',
          telefono: response.data.telefono || '',
          fecha_nacimiento: response.data.fecha_nacimiento || '',
          genero: response.data.genero || ''
        });
        setHasPersonalData(!!response.data.nombre);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      showMessage('Error al cargar los datos del usuario', 'error');
    }
  };

  const fetchUserAddresses = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/admin/get_user_addresses/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.data) {
        setAddresses(response.data);
      }
    } catch (error) {
      console.error('Error fetching user addresses:', error);
      setError('Error al cargar las direcciones del usuario');
    }
  };

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const currentUser = auth.currentUser;
    if (!currentUser) {
        setError('No hay sesión activa en Firebase');
        return;
    }

    try {
        // 1. Primero actualizamos en Firebase
        await updateEmail(currentUser, userData.email);
        
        // 2. Obtenemos el nuevo token después de actualizar el email
        const newToken = await currentUser.getIdToken(true);
        localStorage.setItem('token', newToken);

        // 3. Actualizamos en la base de datos con el nuevo token
        const response = await axios.put(
            `http://localhost:3000/admin/update_user/${user.firebase_uid}`,
            {
                email: userData.email,
                rol: userData.rol
            },
            {
                headers: {
                    'Authorization': `Bearer ${newToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.status === 200) {
            setSuccess('Credenciales actualizadas correctamente');
            onUpdate(); // Actualizamos la lista de usuarios
        }
    } catch (error) {
        console.error('Error al actualizar credenciales:', error);
        if (error.code === 'auth/requires-recent-login') {
            setError('Por favor, vuelve a iniciar sesión para actualizar el email');
            await auth.signOut();
            localStorage.removeItem('token');
        } else if (error.code === 'auth/email-already-in-use') {
            setError('El email ya está en uso por otro usuario');
        } else if (error.response?.status === 401) {
            setError('Sesión expirada, por favor vuelva a iniciar sesión');
            await auth.signOut();
            localStorage.removeItem('token');
        } else {
            setError('Error al actualizar las credenciales');
        }
    } finally {
        setLoading(false);
    }
  };

  const handleUserDataSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validaciones
    const dniError = validateDNI(userData.dni);
    const phoneError = validatePhone(userData.telefono);
    const birthDateError = validateBirthDate(userData.fecha_nacimiento);

    if (dniError || phoneError || birthDateError) {
      setError(
        [dniError, phoneError, birthDateError]
          .filter(error => error)
          .join('\n')
      );
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/admin/update_user_data/${user.id}`,
        userData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.status === 200) {
        setSuccess('Datos personales actualizados correctamente');
        onUpdate(); // Actualizamos la lista de usuarios
      }
    } catch (error) {
      console.error('Error al actualizar datos personales:', error);
      setError(error.response?.data?.message || 'Error al actualizar los datos personales');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = async (address) => {
    setSelectedAddress(address);
    
    setNewAddress({
      titulo: address.titulo,
      direccion: address.direccion,
      departamento: address.departamento,
      provincia: address.provincia,
      distrito: address.distrito,
      referencia: address.referencia,
      codigo_postal: address.codigo_postal,
      es_principal: address.es_principal
    });

    setDepartamento(address.departamento);
    const provinciasFiltradas = Array.from(new Set(ubigeos
      .filter(u => u.NOMBDEP === address.departamento)
      .map(u => u.NOMBPROV)));
    setProvinciasFiltradas(provinciasFiltradas);

    await new Promise(resolve => setTimeout(resolve, 50));

    setProvincia(address.provincia);
    const distritosFiltrados = Array.from(new Set(ubigeos
      .filter(u => u.NOMBDEP === address.departamento && u.NOMBPROV === address.provincia)
      .map(u => u.NOMBDIST)));
    setDistritosFiltrados(distritosFiltrados);

    await new Promise(resolve => setTimeout(resolve, 50));

    setDistrito(address.distrito);
  };

  const handleDepartamentoChange = (e) => {
    const selectedDepartamento = e.target.value;
    setDepartamento(selectedDepartamento);
    
    if (selectedAddress) {
      const provinciasFiltradas = Array.from(new Set(ubigeos
        .filter(u => u.NOMBDEP === selectedDepartamento)
        .map(u => u.NOMBPROV)));
      setProvinciasFiltradas(provinciasFiltradas);
    } else {
      setProvincia('');
      setDistrito('');
      const provinciasFiltradas = Array.from(new Set(ubigeos
        .filter(u => u.NOMBDEP === selectedDepartamento)
        .map(u => u.NOMBPROV)));
      setProvinciasFiltradas(provinciasFiltradas);
      setDistritosFiltrados([]);
    }
  };

  const handleProvinciaChange = (e) => {
    const selectedProvincia = e.target.value;
    setProvincia(selectedProvincia);
    
    if (selectedAddress) {
      const distritosFiltrados = Array.from(new Set(ubigeos
        .filter(u => u.NOMBDEP === departamento && u.NOMBPROV === selectedProvincia)
        .map(u => u.NOMBDIST)));
      setDistritosFiltrados(distritosFiltrados);
    } else {
      setDistrito('');
      const distritosFiltrados = Array.from(new Set(ubigeos
        .filter(u => u.NOMBDEP === departamento && u.NOMBPROV === selectedProvincia)
        .map(u => u.NOMBDIST)));
      setDistritosFiltrados(distritosFiltrados);
    }
  };

  const handleDistritoChange = (e) => {
    setDistrito(e.target.value);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (selectedAddress) {
        await axios.put(
          `http://localhost:3000/admin/update_user_address/${user.id}/${selectedAddress.id_direccion}`,
          {
            ...newAddress,
            departamento,
            provincia,
            distrito
          },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setSuccess('Dirección actualizada correctamente');
      } else {
        await axios.post(
          `http://localhost:3000/admin/create_user_address/${user.id}`,
          {
            ...newAddress,
            departamento,
            provincia,
            distrito
          },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setSuccess('Dirección guardada correctamente');
      }
      
      setSelectedAddress(null);
      setNewAddress({
        titulo: '',
        direccion: '',
        departamento: '',
        provincia: '',
        distrito: '',
        referencia: '',
        codigo_postal: '',
        es_principal: false
      });
      setDepartamento('');
      setProvincia('');
      setDistrito('');
      await fetchUserAddresses();
      onUpdate(); // Actualizamos la lista de usuarios
    } catch (error) {
      setError(error.response?.data || 'Error al guardar la dirección');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddressClick = (address) => {
    setAddressToDelete(address);
    setIsDeleteAddressModalOpen(true);
  };

  const handleConfirmDeleteAddress = async () => {
    try {
      setDeletingAddressId(addressToDelete.id_direccion);
      await axios.delete(`http://localhost:3000/admin/delete_user_address/${user.id}/${addressToDelete.id_direccion}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      setTimeout(() => {
        setAddresses(addresses.filter(addr => addr.id_direccion !== addressToDelete.id_direccion));
        setDeletingAddressId(null);
        setIsDeleteAddressModalOpen(false);
        setAddressToDelete(null);
        showMessage('Dirección eliminada correctamente');
      }, 500);
    } catch (error) {
      showMessage(error.response?.data || 'Error al eliminar la dirección', 'error');
      setDeletingAddressId(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.delete(`http://localhost:3000/admin/delete_user/${userId}`);
      showMessage('Usuario eliminado correctamente');
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key={`modal-container-${user.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            key={`modal-content-${user.id}`}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
          >
            <div key={`modal-background-${user.id}`} className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[20rem] font-serif text-gray-100 select-none">IV</span>
            </div>
            <div className="relative z-10 p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-serif font-light text-gray-800">
                  Editar Usuario
                </h2>
                <button
                  onClick={() => {
                    resetFormFields();
                    onClose();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} className="text-gray-500" />
                </button>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-600 mb-2">
                    <AlertTriangle size={20} />
                    <span className="font-medium">Error</span>
                  </div>
                  <div className="text-sm text-red-600 whitespace-pre-line">
                    {error}
                  </div>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-600 mb-2">
                    <CheckCircle size={20} />
                    <span className="font-medium">Éxito</span>
                  </div>
                  <div className="text-sm text-green-600 mb-4">
                    {success}
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-green-600 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-8">
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-serif font-light text-gray-800 mb-4">Datos de Acceso</h3>
                  <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-light text-gray-500 mb-1">Email</label>
                      <input
                        type="email"
                        required
                        className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                        value={userData.email}
                        onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-light text-gray-500 mb-1">Rol</label>
                      <select
                        required
                        className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                        value={userData.rol}
                        onChange={(e) => setUserData(prev => ({ ...prev, rol: e.target.value }))}
                      >
                        <option value="usuario">Usuario</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "Guardando..." : "Guardar Credenciales"}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-serif font-light text-gray-800 mb-4">Datos Personales</h3>
                  <form onSubmit={handleUserDataSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-light text-gray-500 mb-1">Nombre</label>
                        <input
                          type="text"
                          required
                          className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                          value={userData.nombre}
                          onChange={(e) => setUserData(prev => ({ ...prev, nombre: e.target.value }))}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-light text-gray-500 mb-1">Apellido</label>
                        <input
                          type="text"
                          required
                          className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                          value={userData.apellido}
                          onChange={(e) => setUserData(prev => ({ ...prev, apellido: e.target.value }))}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-light text-gray-500 mb-1">DNI (8 dígitos)</label>
                        <input
                          type="text"
                          required
                          maxLength={8}
                          pattern="\d{8}"
                          className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                          value={userData.dni}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            setUserData(prev => ({ ...prev, dni: value }));
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-light text-gray-500 mb-1">Teléfono (9 dígitos)</label>
                        <input
                          type="tel"
                          required
                          maxLength={9}
                          pattern="\d{9}"
                          className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                          value={userData.telefono}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            setUserData(prev => ({ ...prev, telefono: value }));
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-light text-gray-500 mb-1">Fecha de Nacimiento</label>
                        <input
                          type="date"
                          required
                          max={new Date().toISOString().split('T')[0]}
                          className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                          value={userData.fecha_nacimiento}
                          onChange={(e) => setUserData(prev => ({ ...prev, fecha_nacimiento: e.target.value }))}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-light text-gray-500 mb-1">Género</label>
                        <select
                          required
                          className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                          value={userData.genero}
                          onChange={(e) => setUserData(prev => ({ ...prev, genero: e.target.value }))}
                        >
                          <option value="">Seleccionar género</option>
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
                        {loading ? "Guardando..." : hasPersonalData ? "Actualizar Datos Personales" : "Guardar Datos Personales"}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-serif font-light text-gray-800 mb-4">Direcciones</h3>
                  
                  {addresses.length > 0 && (
                    <div className="mb-6">
                      <label className="block text-xs font-light text-gray-500 mb-2">Direcciones existentes</label>
                      <div className="space-y-2">
                        {addresses.map((address, index) => (
                          <motion.div
                            key={`address-${address.id_direccion}-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={
                              deletingAddressId === address.id_direccion ? {
                                opacity: 0,
                                scale: 0.8,
                                x: [0, 20, -20, 20, -20, 0],
                                rotate: [0, 5, -5, 5, -5, 0],
                                filter: ["blur(0px)", "blur(2px)", "blur(4px)"],
                                transition: { duration: 0.5 }
                              } : {
                                opacity: 1,
                                y: 0
                              }
                            }
                            className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                          >
                            <div>
                              <span className="font-medium">{address.titulo}</span>
                              <span className="text-gray-500 ml-2">
                                {address.direccion}, {address.distrito}, {address.provincia}
                              </span>
                              {address.es_principal && (
                                <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Principal</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleAddressSelect(address)}
                                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteAddressClick(address)}
                                className="p-2 text-red-500 hover:text-red-700 transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-light text-gray-500 mb-1">Título</label>
                        <input
                          type="text"
                          required
                          className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                          value={newAddress.titulo}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, titulo: e.target.value }))}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-light text-gray-500 mb-1">Dirección</label>
                        <input
                          type="text"
                          required
                          className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                          value={newAddress.direccion}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, direccion: e.target.value }))}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-light text-gray-500 mb-1">Departamento</label>
                        <select
                          required
                          className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                          value={departamento}
                          onChange={handleDepartamentoChange}
                        >
                          <option key="dep-empty" value="">Selecciona</option>
                          {Array.from(new Set(ubigeos.map(u => u.NOMBDEP))).map((dep, index) => (
                            <option key={`dep-${dep}-${index}`} value={dep}>{dep}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-light text-gray-500 mb-1">Provincia</label>
                        <select
                          required
                          className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                          value={provincia}
                          onChange={handleProvinciaChange}
                          disabled={!departamento}
                        >
                          <option key="prov-empty" value="">Selecciona</option>
                          {provinciasFiltradas.map((prov, index) => (
                            <option key={`prov-${prov}-${index}`} value={prov}>{prov}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-light text-gray-500 mb-1">Distrito</label>
                        <select
                          required
                          className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                          value={distrito}
                          onChange={handleDistritoChange}
                          disabled={!provincia}
                        >
                          <option key="dist-empty" value="">Selecciona</option>
                          {distritosFiltrados.map((dist, index) => (
                            <option key={`dist-${dist}-${index}`} value={dist}>{dist}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-light text-gray-500 mb-1">Referencia</label>
                        <input
                          type="text"
                          className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                          value={newAddress.referencia}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, referencia: e.target.value }))}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-light text-gray-500 mb-1">Código Postal</label>
                        <input
                          type="text"
                          className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                          value={newAddress.codigo_postal}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, codigo_postal: e.target.value }))}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-black focus:ring-black"
                            checked={newAddress.es_principal}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, es_principal: e.target.checked }))}
                          />
                          <span className="text-sm text-gray-600">Marcar como dirección principal</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      {selectedAddress && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAddress(null);
                            setNewAddress({
                              titulo: '',
                              direccion: '',
                              departamento: '',
                              provincia: '',
                              distrito: '',
                              referencia: '',
                              codigo_postal: '',
                              es_principal: false
                            });
                            setDepartamento('');
                            setProvincia('');
                            setDistrito('');
                          }}
                          className="px-8 py-3 text-gray-600 hover:text-gray-800 transition-colors font-semibold"
                        >
                          Cancelar
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "Guardando..." : selectedAddress ? "Actualizar Dirección" : "Agregar Dirección"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <DeleteAddressConfirmationModal
        key={`delete-address-modal-${user.id}`}
        isOpen={isDeleteAddressModalOpen}
        onClose={() => {
          setIsDeleteAddressModalOpen(false);
          setAddressToDelete(null);
        }}
        onConfirm={handleConfirmDeleteAddress}
        addressTitle={addressToDelete?.titulo}
      />
    </AnimatePresence>
  );
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, userName }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={`delete-user-container-${userName}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          key={`delete-user-content-${userName}`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-lg w-full max-w-md overflow-hidden shadow-2xl"
        >
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <motion.div
                initial={{ rotate: -10 }}
                animate={{ rotate: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-red-100 p-3 rounded-full"
              >
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </motion.div>
            </div>
            
            <h3 className="text-xl font-serif text-center text-gray-900 mb-2">
              ¿Eliminar Usuario?
            </h3>
            
            <p className="text-gray-600 text-center mb-6">
              ¿Estás seguro de que deseas eliminar al usuario <span className="font-medium">{userName}</span>? 
              Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Eliminar
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const DeleteAddressConfirmationModal = ({ isOpen, onClose, onConfirm, addressTitle }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={`delete-address-container-${addressTitle}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          key={`delete-address-content-${addressTitle}`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-lg w-full max-w-md overflow-hidden shadow-2xl"
        >
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <motion.div
                initial={{ rotate: -10 }}
                animate={{ rotate: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-red-100 p-3 rounded-full"
              >
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </motion.div>
            </div>
            
            <h3 className="text-xl font-serif text-center text-gray-900 mb-2">
              ¿Eliminar Dirección?
            </h3>
            
            <p className="text-gray-600 text-center mb-6">
              ¿Estás seguro de que deseas eliminar la dirección <span className="font-medium">{addressTitle}</span>? 
              Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Eliminar
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Input = ({ label, name, type = "text", value, onChange, maxLength, required }) => {
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
};

const validateDNI = (dni) => {
  if (!dni) return 'El DNI es requerido';
  if (!/^\d{8}$/.test(dni)) {
    return 'El DNI debe tener exactamente 8 dígitos numéricos';
  }
  return '';
};

const validatePhone = (phone) => {
  if (!phone) return 'El teléfono es requerido';
  if (!/^\d{9}$/.test(phone)) {
    return 'El teléfono debe tener exactamente 9 dígitos numéricos';
  }
  return '';
};

const validateBirthDate = (date) => {
  if (!date) return 'La fecha de nacimiento es requerida';
  const birthDate = new Date(date);
  const today = new Date();
  const minAge = 18;
  const maxAge = 100;
  
  // Calcular edad
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (birthDate > today) {
    return 'La fecha de nacimiento no puede ser futura';
  }
  if (age < minAge) {
    return `La edad mínima debe ser ${minAge} años`;
  }
  if (age > maxAge) {
    return `La edad máxima debe ser ${maxAge} años`;
  }
  return '';
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    nuevos: 0,
    clientes: 0,
    admins: 0
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);

  const roles = [
    { id: 'all', label: 'ALL' },
    { id: 'cliente', label: 'CLIENT' },
    { id: 'admin', label: 'ADMIN' },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        'http://localhost:3000/admin/get_users',
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const usersData = response.data.map(user => ({
        id: user.firebase_uid,
        name: `${user.nombre || ''} ${user.apellido || ''}`.trim() || 'Sin nombre',
        email: user.email,
        phone: user.telefono || 'Sin teléfono',
        registrationDate: new Date(user.creado_en).toLocaleDateString(),
        role: user.rol === 'admin' ? 'admin' : 'cliente',
        lastLogin: 'No disponible',
        status: 'active', 
        totalAddresses: user.total_direcciones,
        totalOrders: user.total_pedidos
      }));

      setUsers(usersData);

      const today = new Date().toLocaleDateString();
      const newStats = {
        total: usersData.length,
        nuevos: usersData.filter(user => user.registrationDate === today).length,
        clientes: usersData.filter(user => user.role === 'cliente').length,
        admins: usersData.filter(user => user.role === 'admin').length
      };
      setStats(newStats);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  // Función para obtener usuarios únicos
  const getUniqueUsers = (usersList) => {
    const uniqueUsers = new Map();
    usersList.forEach(user => {
      if (!uniqueUsers.has(user.id)) {
        uniqueUsers.set(user.id, user);
      }
    });
    return Array.from(uniqueUsers.values());
  };

  // Filtrar usuarios con búsqueda y rol
  const filteredUsers = useMemo(() => {
    const uniqueUsers = getUniqueUsers(users);
    return uniqueUsers.filter(user => {
      const matchesSearch = 
        user.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = selectedRole === 'all' || selectedRole === '' || user.role === selectedRole;
      
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, selectedRole]);

  const handleAddUser = async (formData) => {
    try {
      await fetchUsers();
    } catch (error) {
      console.error('Error al agregar usuario:', error);
    }
  };

  const handleEditUser = async (formData) => {
    try {
      await fetchUsers();
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
  };

  const handleEditClick = (user) => {
    if (!user || !user.id) {
      console.error('Usuario inválido:', user);
      return;
    }
    console.log('Editing user:', user);
    setSelectedUser({
      id: user.id,
      email: user.email,
      rol: user.role,
      nombre: user.name.split(' ')[0] || '',
      apellido: user.name.split(' ').slice(1).join(' ') || '',
      telefono: user.phone,
      fecha_nacimiento: '',
      genero: ''
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeletingUserId(userToDelete.id);
      await axios.delete(`http://localhost:3000/admin/delete_user/${userToDelete.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      await fetchUsers();
      setDeletingUserId(null);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      setDeletingUserId(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Terminal size={24} className="text-gray-900" />
          <h1 className="text-2xl font-bold"> Administracion de Usuarios</h1>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2"
        >
          <UserPlus size={20} />
          Agregar Usuario
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Usuarios</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <UsersIcon size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Nuevos Hoy</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.nuevos}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <UserPlus size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clientes</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.clientes}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Shield size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Administradores</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.admins}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Shield size={24} />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedRole === role.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {role.label}
              </button>
            ))}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid' ? 'bg-white shadow-lg scale-110' : ''
                }`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'list' ? 'bg-white shadow-lg scale-110' : ''
                }`}
                onClick={() => setViewMode('list')}
              >
                <List size={20} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user, index) => (
            <div key={`grid-${user.id}-${index}`} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Terminal size={24} className="text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={16} />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>REGISTERED: {user.registrationDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={16} />
                  <span>ADDRESSES: {user.totalAddresses}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ShoppingBag size={16} />
                  <span>ORDERS: {user.totalOrders}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  user.role === 'admin' 
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user.role.toUpperCase()}
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleEditClick(user)}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    [EDIT]
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(user)}
                    className="text-sm text-red-600 hover:text-red-900"
                  >
                    [DELETE]
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Registro</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user, index) => (
                  <tr key={`list-${user.id}-${index}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <Terminal size={16} className="text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.registrationDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEditClick(user)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          [EDIT]
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(user)}
                          className="text-red-600 hover:text-red-900"
                        >
                          [DELETE]
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddUser}
        onUpdate={fetchUsers}
      />

      {selectedUser && (
        <EditUserModal
          key={`modal-${selectedUser.id}-${Date.now()}`}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
          onUpdate={fetchUsers}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        userName={userToDelete?.name || ''}
      />
    </div>
  );
};

export default Users;