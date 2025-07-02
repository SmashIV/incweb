import React, { useState, useEffect } from "react";
import { useCart } from "../components/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Papa from 'papaparse';
import MetodoPago from '../components/business/MetodoPago';
import axios from 'axios';

const steps = [
  "Datos Personales",
  "Dirección de Envío",
  "Método de Pago",
  "Confirmación"
];
const PERU_CENTER = [-9.19, -75.0152];
const PERU_BOUNDS = L.latLngBounds([
  [-18.35, -81.35], // Suroeste
  [-0.04, -68.65],  // Noreste
]);

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position ? <Marker position={position} /> : null;
}

async function reverseGeocode(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`;
  const res = await fetch(url, { headers: { 'Accept-Language': 'es' } });
  if (!res.ok) return null;
  return res.json();
}

function removeAccents(str) {
    return str ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '';
}

function DetallePedido() {
  const { items, totalAmount } = useCart();
  const shipping = items.length === 0 ? 0 : 2;
  const subtotal = items.reduce((sum, item) => (sum + (item.precio_final ?? item.precio_unitario) * item.cantidad), 0);
  const total = subtotal + shipping;

  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Función para navegar el carrusel de productos
  const handleProductNavigation = (direction) => {
    if (direction === 'prev') {
      setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
    } else {
      setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    }
  };

  // Función para retroceder al paso anterior
  const handlePrev = () => {
    setStep(step - 1);
    setStepErrors({});
  };

  // Función para avanzar al siguiente paso
  const handleNextStep = async () => {
    if (!validateStep()) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (step === 0) {
        if (!userData) {
          await saveUserData({
            nombre: form.nombres,
            apellido: form.apellidos,
            dni: form.dni,
            telefono: form.telefono,
            fecha_nacimiento: form.fechaNacimiento,
            genero: form.genero,
          });
        }
      }
      if (step === 1) {
        if (selectedDireccion) {
          await saveDireccionPedido(selectedDireccion.id_direccion);
        } else {
          await saveDireccion({
            titulo: form.titulo,
            direccion: form.direccion,
            departamento: departamento,
            provincia: provincia,
            distrito: distrito,
            referencia: form.referencia,
            codigo_postal: form.codigoPostal,
            es_principal: form.es_principal,
          });
        }
      }
      setStep(step + 1);
    } catch (error) {
      console.error('Error al procesar el paso:', error);
      setStepErrors({ general: 'Error al procesar la información. Por favor, intenta nuevamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepErrors, setStepErrors] = useState({});
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    dni: "",
    telefono: "",
    fechaNacimiento: "",
    genero: "",
    direccion: "",
    ciudad: "",
    region: "",
    codigoPostal: "",
    metodoPago: "",
    tarjeta: "",
    vencimiento: "",
    cvv: "",
    titulo: "",
    referencia: "",
    es_principal: false
  });

  const [mapPosition, setMapPosition] = useState(null);

  const [ubigeos, setUbigeos] = useState([]);
  const [departamento, setDepartamento] = useState("");
  const [provincia, setProvincia] = useState("");
  const [distrito, setDistrito] = useState("");
  const [provinciasFiltradas, setProvinciasFiltradas] = useState([]);
  const [distritosFiltrados, setDistritosFiltrados] = useState([]);

  const [paymentStatus, setPaymentStatus] = useState(null);

  const [userData, setUserData] = useState(null);
  const [direcciones, setDirecciones] = useState([]);
  const [selectedDireccion, setSelectedDireccion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      setProvincia("");
      setDistrito("");
      setDistritosFiltrados([]);
    }
  }, [departamento, ubigeos]);

  useEffect(() => {
    if (departamento && provincia) {
      const dists = Array.from(new Set(ubigeos.filter(u => u.NOMBDEP === departamento && u.NOMBPROV === provincia).map(u => u.NOMBDIST)));
      setDistritosFiltrados(dists);
      setDistrito("");
    }
  }, [provincia, departamento, ubigeos]);

  useEffect(() => {
    setForm(f => ({ ...f, region: departamento, provincia, distrito }));
  }, [departamento, provincia, distrito]);

  useEffect(() => {
    if (mapPosition) {
      (async () => {
        const data = await reverseGeocode(mapPosition[0], mapPosition[1]);
        if (data && data.address) {
          const addressNoAccents = {};
          for (const key in data.address) {
            addressNoAccents[key] = removeAccents(data.address[key]);
          }
          console.log('Nominatim data (sin tildes):', { ...data, address: addressNoAccents });
          const dep = addressNoAccents.state || addressNoAccents.region || addressNoAccents.state_district || "";
          console.log('Departamento detectado (sin tildes):', dep);
          // Solo autocompletar departamento por ahora xd
          const depMatch = ubigeos.find(u => dep && removeAccents(u.NOMBDEP).toLowerCase() === dep.toLowerCase());
          if (depMatch) {
            setDepartamento(depMatch.NOMBDEP);
          }
        }
      })();
    }
  }, [mapPosition, ubigeos]);

  useEffect(() => {
    if (selectedDireccion) {
      setForm(f => ({
        ...f,
        titulo: selectedDireccion.titulo || '',
        direccion: selectedDireccion.direccion || '',
        region: selectedDireccion.departamento || '',
        provincia: selectedDireccion.provincia || '',
        distrito: selectedDireccion.distrito || '',
        referencia: selectedDireccion.referencia || '',
        codigoPostal: selectedDireccion.codigo_postal || '',
        es_principal: !!selectedDireccion.es_principal,
      }));
      
      // Autocompletado secuencial: primero departamento
      setDepartamento(selectedDireccion.departamento || '');
      
      // Después de 100ms, autocompletar provincia
      setTimeout(() => {
        setProvincia(selectedDireccion.provincia || '');
      }, 100);
      
      // Después de 200ms, autocompletar distrito
      setTimeout(() => {
        setDistrito(selectedDireccion.distrito || '');
      }, 200);
    }
  }, [selectedDireccion]);

  useEffect(() => {
    const fetchDirecciones = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('Usuario no autenticado');
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:3000/payment/direccion_usuario`,
          { headers: {Authorization: `Bearer ${token}`} }
        );
        setDirecciones(response.data);
      } catch(e) {
          console.error("Error al obtener direcciones:", e);
      }
    };
    
    fetchDirecciones();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('Usuario no autenticado');
        setIsLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          'http://localhost:3000/payment/get_usuario_datos',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data) {
          setUserData(response.data);
          // Si hay datos, los prellenamos en el formulario
          setForm(f => ({
            ...f,
            nombres: response.data.nombre || '',
            apellidos: response.data.apellido || '',
            dni: response.data.dni || '',
            telefono: response.data.telefono || '',
            fechaNacimiento: response.data.fecha_nacimiento || '',
            genero: response.data.genero || '',
          }));
        }
      } catch (e) {
        console.error("Error al obtener datos del usuario:", e);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const validateStep = () => {
    let newErrors = {};
    if (step === 0) {
      if (!form.nombres) newErrors.nombres = "Requerido";
      if (!form.apellidos) newErrors.apellidos = "Requerido";
      if (!form.dni) newErrors.dni = "Requerido";
      if (!form.telefono) newErrors.telefono = "Requerido";
      if (form.dni && !/^\d{8}$/.test(form.dni)) {
        newErrors.dni = "DNI debe tener 8 dígitos";
      }
      if (form.telefono && !/^\d{9}$/.test(form.telefono)) {
        newErrors.telefono = "Teléfono debe tener 9 dígitos";
      }
    }
    if (step === 1) {
      if (!selectedDireccion) {
        if (!form.direccion) newErrors.direccion = "Requerido";
        if (!departamento) newErrors.departamento = "Requerido";
        if (!provincia) newErrors.provincia = "Requerido";
        if (!distrito) newErrors.distrito = "Requerido";
        if (!form.codigoPostal) newErrors.codigoPostal = "Requerido";
      }
      if (!selectedDireccion && (!form.direccion || !departamento || !provincia || !distrito || !form.codigoPostal)) {
        newErrors.general = "Debes completar la información de dirección para continuar";
      }
    }
    setStepErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep()) {
      try {
        setPaymentStatus('success'); 
      } catch {
        setPaymentStatus('error');
      }
    }
  };

  const saveUserData = async (userData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Usuario no autenticado.');
      return;
    }
    try {
      await axios.put(
        'http://localhost:3000/payment/agregar_usuario_datos',
        userData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (e) {
      if (e.response) {
        console.error('Error al guardar datos personales:', e.response.data);
      } else {
        console.error('Error al guardar datos personales:', e.message);
      }
    }
  };

  const saveDireccion = async (direccion) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Usuario no autenticado.');
      return;
    }
    try {
      await axios.post(
        'http://localhost:3000/payment/agregar_direccion_usuario',
        direccion,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (e) {
      if (e.response) {
        console.error('Error al guardar dirección:', e.response.data);
      } else {
        console.error('Error al guardar dirección:', e.message);
      }
    }
  };

  const saveDireccionPedido = async (id_direccion) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Usuario no autenticado.');
      return;
    }
    try {
      await axios.post(
        'http://localhost:3000/payment/save_direccion_pedido',
        { direccion_id: id_direccion },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (e) {
      if (e.response) {
        console.error('Error al guardar dirección del pedido:', e.response.data);
      } else {
        console.error('Error al guardar dirección del pedido:', e.message);
      }
    }
  };

  const handlePaymentSuccess = (data) => {
    setPaymentStatus('success');
    // Redirigir a página de confirmación después de 2 segundos
    setTimeout(() => {
      if (data && data.id_pedido) {
        window.location.href = `/confirmacion/${data.id_pedido}`;
      } else {
        console.error('No se recibió id_pedido en la respuesta de pago');
        // Fallback: redirigir al inicio
        window.location.href = '/';
      }
    }, 2000);
  };

  const handlePaymentError = (error) => {
    setPaymentStatus('error');
    setStepErrors({ payment: error.message || 'Error al procesar el pago' });
  };

  return (
    <div className="min-h-screen text-black flex flex-col items-center justify-start py-10 bg-gray-50">
      <div className="w-full max-w-[1500px] p-8 rounded-2xl bg-white shadow-lg flex flex-col lg:flex-row gap-8">
        <div className="flex flex-col gap-6 max-w-[340px] w-full">
          {step === 1 ? (
            <div className="bg-[#F5E9DA] rounded-xl p-2 shadow border border-[#C19A6B] flex flex-col items-center justify-center min-h-[340px]">
              <h3 className="font-bold text-sm mb-2 text-[#8B5C2A]">Selecciona tu ubicación en el mapa</h3>
              <MapContainer
                center={PERU_CENTER}
                zoom={5.2}
                minZoom={5}
                maxZoom={12}
                scrollWheelZoom={true}
                style={{ width: '100%', height: 300, borderRadius: '0.75rem', zIndex: 1 }}
                maxBounds={PERU_BOUNDS}
                maxBoundsViscosity={1.0}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={mapPosition} setPosition={setMapPosition} />
              </MapContainer>
              {mapPosition && (
                <div className="mt-2 text-xs text-[#8B5C2A] text-center">
                  Lat: {mapPosition[0].toFixed(4)}, Lng: {mapPosition[1].toFixed(4)}
                </div>
              )}
              <div className="mt-2 text-xs text-gray-500 text-center">Haz clic en el mapa para seleccionar tu ubicación.</div>
            </div>
          ) : (
            <>
              <div className="bg-[#F5E9DA] rounded-xl p-4 pb-8 shadow border border-[#C19A6B] flex flex-col items-center min-h-[320px] max-h-[380px] justify-between relative">
                <h3 className="font-bold text-base mb-1 text-[#8B5C2A] self-start">Producto</h3>
                {items.length === 0 ? (
                  <div className="text-center text-gray-400 py-6 w-full">No hay productos en el carrito.</div>
                ) : (
                  <div className="w-full flex flex-col items-center justify-center h-full">
                    <AnimatePresence initial={false} mode="wait">
                      <motion.div
                        key={items[currentIndex]?.id + '-' + items[currentIndex]?.talla}
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -60 }}
                        transition={{ duration: 0.35, type: "spring" }}
                        className="w-full flex flex-col items-center justify-center"
                        style={{ minHeight: 120 }}
                      >
                        <div className="w-full flex flex-col items-center">
                          <div className="w-[120px] h-[160px] md:w-[150px] md:h-[200px] rounded-xl overflow-hidden bg-gray-50 shadow flex items-center justify-center mb-3">
                            <img
                              src={`/${items[currentIndex].imagen}`}
                              alt={items[currentIndex].nombre}
                              className="object-contain w-full h-full"
                            />
                          </div>
                          <div className="text-center space-y-1 mb-2">
                            <div className="text-[#C19A6B] text-xs font-semibold uppercase tracking-wide">
                              {items[currentIndex].categoria?.nombre || "Sin categoría"}
                            </div>
                            <div className="text-[#8B5C2A] font-bold text-base">
                              {items[currentIndex].nombre}
                            </div>
                            <div className="text-[#C19A6B] text-xs font-medium">
                              Talla: {items[currentIndex].talla}
                            </div>
                            {items[currentIndex].color && (
                              <div className="text-[#C19A6B] text-xs font-medium">
                                Color: {items[currentIndex].color}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                    {items.length > 1 && (
                      <div className="flex justify-center items-center gap-3 mt-3">
                        <button
                          onClick={() => handleProductNavigation('prev')}
                          className="w-7 h-7 rounded-full bg-[#C19A6B] text-white flex items-center justify-center hover:bg-[#8B5C2A] transition"
                          aria-label="Producto anterior"
                        >
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                        <span className="text-[#8B5C2A] font-semibold text-xs">{currentIndex + 1} / {items.length}</span>
                        <button
                          onClick={() => handleProductNavigation('next')}
                          className="w-7 h-7 rounded-full bg-[#C19A6B] text-white flex items-center justify-center hover:bg-[#8B5C2A] transition"
                          aria-label="Producto siguiente"
                        >
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="bg-[#F5E9DA] rounded-xl p-2 pb-[2px] shadow border border-[#C19A6B] mt-1">
                <h3 className="font-bold text-sm mb-2 text-[#8B5C2A]">Resumen del Pedido</h3>
                <div className="flex justify-between text-[#8B5C2A] font-medium text-xs mb-0.5">
                  <span>Subtotal</span>
                  <span>S/ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#8B5C2A] text-xs mb-0.5">
                  <span>Envío</span>
                  <span>S/ {shipping.toFixed(2)}</span>
                </div>
                <hr className="my-1 border-[#C19A6B]" />
                <div className="flex justify-between text-base font-bold text-[#8B5C2A]">
                  <span>Total</span>
                  <span>S/ {total.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="hidden lg:flex items-stretch">
          <div className="w-px bg-[#C19A6B] opacity-60 mx-4" />
        </div>
        <div className="flex-1 flex flex-col h-auto justify-start">
          <div className="flex justify-between mb-8">
            {steps.map((s, i) => (
              <div key={s} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                    i <= step ? "bg-[#8B5C2A] text-white border-[#8B5C2A]" : "bg-[#F5E9DA] text-[#8B5C2A] border-[#C19A6B]"
                  }`}
                >
                  {i + 1}
                </div>
                <span className={`mt-2 text-xs font-semibold ${i === step ? "text-[#8B5C2A]" : "text-[#C19A6B]"}`}>{s}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {step === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold">Nombres</label>
                  <input 
                    name="nombres" 
                    value={form.nombres} 
                    onChange={handleChange} 
                    className={`input ${userData ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    disabled={!!userData}
                  />
                  {stepErrors.nombres && <span className="text-red-500 text-xs">{stepErrors.nombres}</span>}
                </div>
                <div>
                  <label className="block font-semibold">Apellidos</label>
                  <input 
                    name="apellidos" 
                    value={form.apellidos} 
                    onChange={handleChange} 
                    className={`input ${userData ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    disabled={!!userData}
                  />
                  {stepErrors.apellidos && <span className="text-red-500 text-xs">{stepErrors.apellidos}</span>}
                </div>
                <div>
                  <label className="block font-semibold">DNI</label>
                  <input 
                    name="dni" 
                    value={form.dni} 
                    onChange={handleChange} 
                    className={`input ${userData ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    disabled={!!userData}
                  />
                  {stepErrors.dni && <span className="text-red-500 text-xs">{stepErrors.dni}</span>}
                </div>
                <div>
                  <label className="block font-semibold">Teléfono</label>
                  <input 
                    name="telefono" 
                    value={form.telefono} 
                    onChange={handleChange} 
                    className={`input ${userData ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    disabled={!!userData}
                  />
                  {stepErrors.telefono && <span className="text-red-500 text-xs">{stepErrors.telefono}</span>}
                </div>
                <div>
                  <label className="block font-semibold">Fecha de Nacimiento</label>
                  <input 
                    type="date" 
                    name="fechaNacimiento" 
                    value={form.fechaNacimiento} 
                    onChange={handleChange} 
                    className={`input ${userData ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    disabled={!!userData}
                  />
                </div>
                <div>
                  <label className="block font-semibold">Género</label>
                  <select 
                    name="genero" 
                    value={form.genero} 
                    onChange={handleChange} 
                    className={`input ${userData ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    disabled={!!userData}
                  >
                    <option value="">Selecciona</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                {userData && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 italic">
                      Los datos personales no pueden ser modificados. Si necesitas actualizarlos, por favor contacta a soporte.
                    </p>
                  </div>
                )}
              </div>
            )}

            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block font-semibold">Selecciona una dirección guardada</label>
                  <select
                    className="input"
                    value={selectedDireccion ? selectedDireccion.id_direccion : ''}
                    onChange={e => {
                      if (e.target.value === '') {
                        setSelectedDireccion(null);
                        setForm(f => ({
                          ...f,
                          titulo: '',
                          direccion: '',
                          referencia: '',
                          codigoPostal: '',
                          es_principal: false
                        }));
                        setDepartamento('');
                        setProvincia('');
                        setDistrito('');
                      } else {
                        const found = direcciones.find(d => d.id_direccion === Number(e.target.value));
                        setSelectedDireccion(found);
                      }
                    }}
                  >
                    <option value="">Nueva dirección</option>
                    {direcciones.map(dir => (
                      <option key={dir.id_direccion} value={dir.id_direccion}>
                        {dir.titulo || dir.direccion}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold">Título de dirección</label>
                  <input name="titulo" value={form.titulo || ''} onChange={handleChange} className="input" placeholder="Ej: Casa, Oficina..." />
                </div>
                <div>
                  <label className="block font-semibold">Dirección</label>
                  <input name="direccion" value={form.direccion} onChange={handleChange} className="input" />
                  {stepErrors.direccion && <span className="text-red-500 text-xs">{stepErrors.direccion}</span>}
                </div>
                <div>
                  <label className="block font-semibold">Departamento</label>
                  <select className="input" value={departamento} onChange={e => setDepartamento(e.target.value)}>
                    <option value="">Selecciona</option>
                    {Array.from(new Set(ubigeos.map(u => u.NOMBDEP))).map(dep => (
                      <option key={dep} value={dep}>{dep}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold">Provincia</label>
                  <select className="input" value={provincia} onChange={e => setProvincia(e.target.value)} disabled={!departamento}>
                    <option value="">Selecciona</option>
                    {provinciasFiltradas.map(prov => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold">Distrito</label>
                  <select className="input" value={distrito} onChange={e => setDistrito(e.target.value)} disabled={!provincia}>
                    <option value="">Selecciona</option>
                    {distritosFiltrados.map(dist => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold">Referencia</label>
                  <input name="referencia" value={form.referencia || ''} onChange={handleChange} className="input" placeholder="Referencia adicional" />
                </div>
                <div>
                  <label className="block font-semibold">Código Postal</label>
                  <input name="codigoPostal" value={form.codigoPostal} onChange={handleChange} className="input" />
                  {stepErrors.codigoPostal && <span className="text-red-500 text-xs">{stepErrors.codigoPostal}</span>}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" name="es_principal" checked={form.es_principal || false} onChange={e => setForm(f => ({ ...f, es_principal: e.target.checked }))} />
                  <label className="text-sm">¿Dirección principal?</label>
                </div>
              </div>
            )}

            {step === 2 && (
              <MetodoPago 
                total={total}
                id_direccion={selectedDireccion?.id_direccion || null}
                form={form} 
                errors={stepErrors} 
                handleChange={handleChange}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  Resumen del Pedido
                  {paymentStatus === 'success' && (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-600 border border-green-400">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                  )}
                  {paymentStatus === 'error' && (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-100 text-red-600 border border-red-400">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                  )}
                </h3>
                <div className="bg-[#F5E9DA] border border-[#C19A6B] rounded-xl p-6 flex flex-col gap-2 shadow-sm">
                  <div className="flex flex-wrap gap-4 mb-2">
                    <div className="flex-1 min-w-[180px]">
                      <div className="text-xs text-[#C19A6B] font-semibold mb-1">Nombre</div>
                      <div className="font-bold text-[#8B5C2A]">{form.nombres} {form.apellidos}</div>
                    </div>
                    <div className="flex-1 min-w-[120px]">
                      <div className="text-xs text-[#C19A6B] font-semibold mb-1">DNI</div>
                      <div className="text-[#8B5C2A]">{form.dni}</div>
                    </div>
                    <div className="flex-1 min-w-[120px]">
                      <div className="text-xs text-[#C19A6B] font-semibold mb-1">Teléfono</div>
                      <div className="text-[#8B5C2A]">{form.telefono}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mb-2">
                    <div className="flex-1 min-w-[220px]">
                      <div className="text-xs text-[#C19A6B] font-semibold mb-1">Dirección</div>
                      <div className="text-[#8B5C2A]">{form.direccion}, {form.ciudad}, {form.region}, {form.codigoPostal}</div>
                    </div>
                    <div className="flex-1 min-w-[120px]">
                      <div className="text-xs text-[#C19A6B] font-semibold mb-1">Referencia</div>
                      <div className="text-[#8B5C2A]">{form.referencia}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mb-2">
                    <div className="flex-1 min-w-[120px]">
                      <div className="text-xs text-[#C19A6B] font-semibold mb-1">Método de Pago</div>
                      <div className="text-[#8B5C2A]">{form.metodoPago}</div>
                    </div>
                    {form.metodoPago === "tarjeta" && (
                      <div className="flex-1 min-w-[120px]">
                        <div className="text-xs text-[#C19A6B] font-semibold mb-1">Tarjeta</div>
                        <div className="text-[#8B5C2A]">**** **** **** {form.tarjeta.slice(-4)}</div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 border-t border-[#C19A6B] pt-3 mt-2">
                    <div className="flex-1 min-w-[120px]">
                      <div className="text-xs text-[#C19A6B] font-semibold mb-1">Subtotal</div>
                      <div className="text-[#8B5C2A]">S/ {subtotal.toFixed(2)}</div>
                    </div>
                    <div className="flex-1 min-w-[120px]">
                      <div className="text-xs text-[#C19A6B] font-semibold mb-1">Envío</div>
                      <div className="text-[#8B5C2A]">S/ {shipping.toFixed(2)}</div>
                    </div>
                    <div className="flex-1 min-w-[120px]">
                      <div className="text-xs text-[#C19A6B] font-semibold mb-1">Total</div>
                      <div className="font-bold text-[#8B5C2A] text-lg">S/ {total.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
                <p className="text-green-700 font-semibold text-sm flex items-center gap-2">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Por favor, revisa que toda la información sea correcta antes de confirmar tu pedido.
                </p>
                {paymentStatus === 'success' && (
                  <div className="text-green-600 font-bold flex items-center gap-2 mt-2">
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    ¡Pago realizado con éxito!
                  </div>
                )}
                {paymentStatus === 'error' && (
                  <div className="text-red-600 font-bold flex items-center gap-2 mt-2">
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Hubo un error al procesar el pago. Intenta nuevamente o contacta soporte.
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between mt-8">
              {step > 0 && (
                <button 
                  type="button" 
                  onClick={handlePrev} 
                  className="px-6 py-2 rounded bg-[#C19A6B] text-white hover:bg-[#8B5C2A] font-semibold transition-colors duration-200 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Atrás
                </button>
              )}
              {step < steps.length - 1 && (
                <button 
                  type="button" 
                  onClick={handleNextStep} 
                  className="ml-auto px-6 py-2 rounded bg-[#8B5C2A] text-white hover:bg-[#C19A6B] font-semibold transition-colors duration-200 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Procesando...' : 'Siguiente'}
                </button>
              )}
              {step === steps.length - 1 && (
                <button 
                  type="submit" 
                  className="ml-auto px-6 py-2 rounded bg-[#8B5C2A] text-white hover:bg-[#C19A6B] font-semibold transition-colors duration-200 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
                </button>
              )}
            </div>
          </form>
          {stepErrors.general && (
            <div className="mt-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              {stepErrors.general}
            </div>
          )}
        </div>
      </div>
      <style>{`
        .input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid #C19A6B;
          margin-top: 0.25rem;
          margin-bottom: 0.5rem;
          outline: none;
          transition: border 0.2s;
        }
        .input:focus {
          border-color: #8B5C2A;
        }
      `}</style>
    </div>
  );
}

export default DetallePedido;