import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, UserPlus, Mail, Phone, Calendar, Shield, Search, Filter, Terminal, Code, Server, Database, Eye, EyeOff, MapPin, CreditCard, ShoppingBag, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../config/firebase';
import Papa from 'papaparse';

const AddUserModal = ({ isOpen, onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [ubigeos, setUbigeos] = useState([]);
  const [departamento, setDepartamento] = useState('');
  const [provincia, setProvincia] = useState('');
  const [distrito, setDistrito] = useState('');
  const [provinciasFiltradas, setProvinciasFiltradas] = useState([]);
  const [distritosFiltrados, setDistritosFiltrados] = useState([]);
  
  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    rol: 'usuario'
  });

  const [userData, setUserData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    fecha_nacimiento: '',
    genero: ''
  });

  const [address, setAddress] = useState({
    titulo: '',
    direccion: '',
    departamento: '',
    provincia: '',
    distrito: '',
    referencia: '',
    codigo_postal: '',
    es_principal: false
  });

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

  useEffect(() => {
    setAddress(prev => ({
      ...prev,
      departamento,
      provincia,
      distrito
    }));
  }, [departamento, provincia, distrito]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, authData.email, authData.password);
      const firebase_uid = userCredential.user.uid;

      await axios.post(
        'http://localhost:3000/admin/create_user',
        {
          firebase_uid,
          email: authData.email,
          rol: authData.rol
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setAuthData({
        email: '',
        password: '',
        rol: 'usuario'
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUserDataSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(
        `http://localhost:3000/admin/get_user_by_email/${authData.email}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data) {
        throw new Error('Usuario no encontrado. Primero debe crear las credenciales de acceso.');
      }

      await axios.post(
        'http://localhost:3000/admin/create_user_data',
        {
          ...userData,
          firebase_uid: response.data.firebase_uid
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setUserData({
        nombre: '',
        apellido: '',
        dni: '',
        telefono: '',
        fecha_nacimiento: '',
        genero: ''
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Primero buscar el usuario por email para obtener su firebase_uid
      const response = await axios.get(
        `http://localhost:3000/admin/get_user_by_email/${authData.email}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data) {
        throw new Error('Usuario no encontrado. Primero debe crear las credenciales de acceso.');
      }

      await axios.post(
        'http://localhost:3000/admin/create_user_address',
        {
          ...address,
          firebase_uid: response.data.firebase_uid
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setAddress({
        titulo: '',
        direccion: '',
        departamento: '',
        provincia: '',
        distrito: '',
        referencia: '',
        codigo_postal: '',
        es_principal: false
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
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
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                        className="px-6 py-2 text-sm font-light text-white bg-black rounded-md hover:bg-gray-800 disabled:opacity-50"
                      >
                        {loading ? 'Guardando...' : 'Guardar Credenciales'}
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
                        <label className="block text-xs font-light text-gray-500 mb-1">DNI</label>
                        <input
                          type="text"
                          required
                          className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                          value={userData.dni}
                          onChange={(e) => setUserData(prev => ({ ...prev, dni: e.target.value }))}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-light text-gray-500 mb-1">Teléfono</label>
                        <input
                          type="tel"
                          required
                          className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                          value={userData.telefono}
                          onChange={(e) => setUserData(prev => ({ ...prev, telefono: e.target.value }))}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-light text-gray-500 mb-1">Fecha de Nacimiento</label>
                        <input
                          type="date"
                          required
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
                        className="px-6 py-2 text-sm font-light text-white bg-black rounded-md hover:bg-gray-800 disabled:opacity-50"
                      >
                        {loading ? 'Guardando...' : 'Guardar Datos Personales'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Sección de Dirección */}
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-serif font-light text-gray-800 mb-4">Dirección</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-light text-gray-500 mb-1">Título</label>
                      <input
                        type="text"
                        value={address.titulo}
                        onChange={(e) => setAddress({...address, titulo: e.target.value})}
                        className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-light text-gray-500 mb-1">Dirección</label>
                      <input
                        type="text"
                        value={address.direccion}
                        onChange={(e) => setAddress({...address, direccion: e.target.value})}
                        className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-light text-gray-500 mb-1">Departamento</label>
                      <select
                        value={departamento}
                        onChange={(e) => setDepartamento(e.target.value)}
                        className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                        required
                      >
                        <option value="">Selecciona</option>
                        {Array.from(new Set(ubigeos.map(u => u.NOMBDEP))).map(dep => (
                          <option key={dep} value={dep}>{dep}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-light text-gray-500 mb-1">Provincia</label>
                      <select
                        value={provincia}
                        onChange={(e) => setProvincia(e.target.value)}
                        className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                        disabled={!departamento}
                        required
                      >
                        <option value="">Selecciona</option>
                        {provinciasFiltradas.map(prov => (
                          <option key={prov} value={prov}>{prov}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-light text-gray-500 mb-1">Distrito</label>
                      <select
                        value={distrito}
                        onChange={(e) => setDistrito(e.target.value)}
                        className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                        disabled={!provincia}
                        required
                      >
                        <option value="">Selecciona</option>
                        {distritosFiltrados.map(dist => (
                          <option key={dist} value={dist}>{dist}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-light text-gray-500 mb-1">Referencia</label>
                      <input
                        type="text"
                        value={address.referencia}
                        onChange={(e) => setAddress({...address, referencia: e.target.value})}
                        className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-light text-gray-500 mb-1">Código Postal</label>
                      <input
                        type="text"
                        value={address.codigo_postal}
                        onChange={(e) => setAddress({...address, codigo_postal: e.target.value})}
                        className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-black focus:ring-black"
                          checked={address.es_principal}
                          onChange={(e) => setAddress({...address, es_principal: e.target.checked})}
                        />
                        <span className="text-sm text-gray-600">Marcar como dirección principal</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const EditUserModal = ({ isOpen, onClose, user }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [ubigeos, setUbigeos] = useState([]);
  const [departamento, setDepartamento] = useState('');
  const [provincia, setProvincia] = useState('');
  const [distrito, setDistrito] = useState('');
  const [provinciasFiltradas, setProvinciasFiltradas] = useState([]);
  const [distritosFiltrados, setDistritosFiltrados] = useState([]);
  
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
      if (provincia && !provs.includes(provincia)) {
        setProvincia('');
        setDistrito('');
      }
    }
  }, [departamento, ubigeos]);

  useEffect(() => {
    if (departamento && provincia) {
      const dists = Array.from(new Set(ubigeos.filter(u => u.NOMBDEP === departamento && u.NOMBPROV === provincia).map(u => u.NOMBDIST)));
      setDistritosFiltrados(dists);
      if (distrito && !dists.includes(distrito)) {
        setDistrito('');
      }
    }
  }, [provincia, departamento, ubigeos]);

  useEffect(() => {
    if (selectedAddress) {
      setDepartamento(selectedAddress.departamento || '');
      setProvincia(selectedAddress.provincia || '');
      setDistrito(selectedAddress.distrito || '');
    }
  }, [selectedAddress]);

  useEffect(() => {
    if (user?.id) {
      fetchUserData();
      fetchUserAddresses();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      console.log('Fetching user data for:', user.id);
      const response = await axios.get(`http://localhost:3000/admin/get_user_data/${user.id}`);
      console.log('User data response:', response.data);
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
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Error al cargar los datos del usuario');
    }
  };

  const fetchUserAddresses = async () => {
    try {
      console.log('Fetching addresses for:', user.id);
      const response = await axios.get(`http://localhost:3000/admin/get_user_addresses/${user.id}`);
      console.log('Addresses response:', response.data);
      if (response.data) {
        setAddresses(response.data);
      }
    } catch (error) {
      console.error('Error fetching user addresses:', error);
      setError('Error al cargar las direcciones del usuario');
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.put(`http://localhost:3000/admin/update_user/${user.id}`, {
        email: userData.email,
        rol: userData.rol
      });
      setSuccess('Datos de autenticación actualizados correctamente');
    } catch (error) {
      console.error('Error updating auth data:', error);
      setError('Error al actualizar los datos de autenticación');
    } finally {
      setLoading(false);
    }
  };

  const handleUserDataSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.put(`http://localhost:3000/admin/update_user_data/${user.id}`, {
        firebase_uid: user.id,
        ...userData
      });
      setSuccess('Datos personales actualizados correctamente');
    } catch (error) {
      console.error('Error updating user data:', error);
      setError('Error al actualizar los datos personales');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setNewAddress({
      titulo: address.titulo,
      direccion: address.direccion,
      departamento: address.departamento,
      provincia: address.provincia,
      distrito: address.distrito,
      referencia: address.referencia || '',
      codigo_postal: address.codigo_postal || '',
      es_principal: address.es_principal
    });
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const addressData = {
        ...newAddress,
        firebase_uid: user.id
      };

      if (selectedAddress) {
        await axios.put(`http://localhost:3000/admin/update_address/${selectedAddress.id_direccion}`, addressData);
        setSuccess('Dirección actualizada correctamente');
      } else {
        await axios.post('http://localhost:3000/admin/add_address', addressData);
        setSuccess('Dirección agregada correctamente');
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
      fetchUserAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      setError('Error al guardar la dirección');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
                  Editar Usuario
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} className="text-gray-500" />
                </button>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
                  {success}
                </div>
              )}

              <div className="space-y-8">
                {/* Sección de Autenticación */}
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-serif font-light text-gray-800 mb-4">Datos de Acceso</h3>
                  <form onSubmit={handleAuthSubmit} className="space-y-4">
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
                        className="px-6 py-2 text-sm font-light text-white bg-black rounded-md hover:bg-gray-800 disabled:opacity-50"
                      >
                        {loading ? 'Guardando...' : 'Guardar Credenciales'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Sección de Datos Personales */}
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
                        <label className="block text-xs font-light text-gray-500 mb-1">DNI</label>
                        <input
                          type="text"
                          required
                          className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                          value={userData.dni}
                          onChange={(e) => setUserData(prev => ({ ...prev, dni: e.target.value }))}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-light text-gray-500 mb-1">Teléfono</label>
                        <input
                          type="tel"
                          required
                          className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                          value={userData.telefono}
                          onChange={(e) => setUserData(prev => ({ ...prev, telefono: e.target.value }))}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-light text-gray-500 mb-1">Fecha de Nacimiento</label>
                        <input
                          type="date"
                          required
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
                        className="px-6 py-2 text-sm font-light text-white bg-black rounded-md hover:bg-gray-800 disabled:opacity-50"
                      >
                        {loading ? 'Guardando...' : 'Guardar Datos Personales'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Sección de Direcciones */}
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-serif font-light text-gray-800 mb-4">Direcciones</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-light text-gray-500 mb-1">Direcciones existentes</label>
                      <select 
                        className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                        onChange={(e) => {
                          const address = addresses.find(addr => addr.id_direccion === parseInt(e.target.value));
                          handleAddressSelect(address);
                        }}
                        value={selectedAddress?.id_direccion || ''}
                      >
                        <option value="">Seleccionar dirección</option>
                        {addresses.map((address) => (
                          <option key={address.id_direccion} value={address.id_direccion}>
                            {address.titulo} - {address.direccion}
                          </option>
                        ))}
                      </select>
                    </div>

                    <form onSubmit={handleAddressSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-light text-gray-500 mb-1">Título</label>
                          <input
                            type="text"
                            value={newAddress.titulo}
                            onChange={(e) => setNewAddress({...newAddress, titulo: e.target.value})}
                            className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-light text-gray-500 mb-1">Dirección</label>
                          <input
                            type="text"
                            value={newAddress.direccion}
                            onChange={(e) => setNewAddress({...newAddress, direccion: e.target.value})}
                            className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-light text-gray-500 mb-1">Departamento</label>
                          <select
                            value={departamento}
                            onChange={(e) => setDepartamento(e.target.value)}
                            className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                            required
                          >
                            <option value="">Selecciona</option>
                            {Array.from(new Set(ubigeos.map(u => u.NOMBDEP))).map(dep => (
                              <option key={dep} value={dep}>{dep}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-light text-gray-500 mb-1">Provincia</label>
                          <select
                            value={provincia}
                            onChange={(e) => setProvincia(e.target.value)}
                            className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                            disabled={!departamento}
                            required
                          >
                            <option value="">Selecciona</option>
                            {provinciasFiltradas.map(prov => (
                              <option key={prov} value={prov}>{prov}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-light text-gray-500 mb-1">Distrito</label>
                          <select
                            value={distrito}
                            onChange={(e) => setDistrito(e.target.value)}
                            className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                            disabled={!provincia}
                            required
                          >
                            <option value="">Selecciona</option>
                            {distritosFiltrados.map(dist => (
                              <option key={dist} value={dist}>{dist}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-light text-gray-500 mb-1">Referencia</label>
                          <input
                            type="text"
                            value={newAddress.referencia}
                            onChange={(e) => setNewAddress({...newAddress, referencia: e.target.value})}
                            className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-light text-gray-500 mb-1">Código Postal</label>
                          <input
                            type="text"
                            value={newAddress.codigo_postal}
                            onChange={(e) => setNewAddress({...newAddress, codigo_postal: e.target.value})}
                            className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-black focus:ring-black"
                              checked={newAddress.es_principal}
                              onChange={(e) => setNewAddress({...newAddress, es_principal: e.target.checked})}
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
                            className="px-6 py-2 text-sm font-light text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50"
                          >
                            Limpiar Formulario
                          </button>
                        )}
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-6 py-2 text-sm font-light text-white bg-black rounded-md hover:bg-gray-800 disabled:opacity-50"
                        >
                          {loading ? 'Guardando...' : selectedAddress ? 'Actualizar Dirección' : 'Agregar Dirección'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
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

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    nuevos: 0,
    clientes: 0,
    admins: 0
  });

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
        role: user.rol,
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

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = (formData) => {
    // TODO: Implement user creation
    console.log('Creating user:', formData);
    setIsAddModalOpen(false);
  };

  const handleEditUser = (formData) => {
    // TODO: Implement user update
    console.log('Updating user:', formData);
    setIsEditModalOpen(false);
    setSelectedUser(null);
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
      rol: user.role
    });
    setIsEditModalOpen(true);
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setRoleFilter(role.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  roleFilter === role.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="p-4">
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
                  <button 
                    onClick={() => handleEditClick(user)}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    [EDIT]
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddUser}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleEditUser}
        user={selectedUser}
      />
    </div>
  );
};

export default Users;