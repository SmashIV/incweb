import React, { useState, useEffect } from 'react';
import { Tag, Plus, Search, Calendar, Percent, DollarSign, Clock, CheckCircle, XCircle, Gift, Trash2, Edit, X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const EditPromotionModal = ({ isOpen, onClose, promotion, onUpdate, editPromotion }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [promotionData, setPromotionData] = useState({
    titulo: "",
    descripcion: "",
    descuento_porcentaje: "",
    fecha_inicio: "",
    fecha_fin: "",
    tipo_aplicacion: "general",
    id_producto: "",
    id_categoria: "",
    talla_objetivo: "",
    color_objetivo: ""
  });

  const categories = [
    { id: 1, nombre: "Abrigo" },
    { id: 2, nombre: "Saco" },
    { id: 3, nombre: "Casaca" },
    { id: 4, nombre: "Sueter" },
    { id: 5, nombre: "Cardigan" },
    { id: 6, nombre: "Chaleco" },
    { id: 7, nombre: "Poncho" },
    { id: 8, nombre: "Capa" },
    { id: 9, nombre: "Estola" },
    { id: 10, nombre: "Gorro" },
    { id: 11, nombre: "Guantes" },
    { id: 12, nombre: "Llavero" },
    { id: 13, nombre: "Peluche" },
    { id: 14, nombre: "Manta" }
  ];

  const tallas = ["XS", "S", "M", "L", "XL"];
  const colores = ["BEIGE", "GRIS", "CAMEL", "AZUL", "VERDE", "NEGRO", "ROSADO", "FUCSIA", "ECRU"];

  useEffect(() => {
    if (isOpen && promotion) {
      setPromotionData({
        titulo: promotion.titulo || "",
        descripcion: promotion.descripcion || "",
        descuento_porcentaje: promotion.descuento_porcentaje?.toString() || "",
        fecha_inicio: promotion.fecha_inicio || "",
        fecha_fin: promotion.fecha_fin || "",
        tipo_aplicacion: promotion.tipo_aplicacion || "general",
        id_producto: promotion.id_producto?.toString() || "",
        id_categoria: promotion.id_categoria?.toString() || "",
        talla_objetivo: promotion.talla_objetivo || "",
        color_objetivo: promotion.color_objetivo || ""
      });
    }
  }, [isOpen, promotion]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!promotionData.titulo || !promotionData.descuento_porcentaje || !promotionData.fecha_inicio || !promotionData.fecha_fin) {
      setError('Todos los campos obligatorios deben estar completos');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        titulo: promotionData.titulo,
        descripcion: promotionData.descripcion,
        descuento_porcentaje: parseFloat(promotionData.descuento_porcentaje),
        fecha_inicio: promotionData.fecha_inicio,
        fecha_fin: promotionData.fecha_fin,
        tipo_aplicacion: promotionData.tipo_aplicacion,
        id_producto: promotionData.id_producto ? parseInt(promotionData.id_producto) : 0,
        id_categoria: promotionData.id_categoria ? parseInt(promotionData.id_categoria) : 0,
        talla_objetivo: promotionData.talla_objetivo || "",
        color_objetivo: promotionData.color_objetivo || ""
      };

      if (promotion) {
        const success = await editPromotion(promotion.id_promociones, payload);
        if (success) {
          setSuccess('Promoción actualizada correctamente');
        }
      } else {
        await axios.post(
          'http://localhost:3000/admin/crear_promotions',
          payload,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setSuccess('Promoción creada correctamente');
      }

      onUpdate();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error al guardar promoción:', error);
      setError(error.response?.data?.message || 'Error al guardar la promoción');
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
                  {promotion ? 'Editar Promoción' : 'Crear Nueva Promoción'}
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
                  <div className="text-sm text-green-600">
                    {success}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título de la Promoción *</label>
                    <input
                      type="text"
                      required
                      placeholder="Descuento Talla XS"
                      value={promotionData.titulo}
                      onChange={(e) => setPromotionData({ ...promotionData, titulo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Aplicación *</label>
                    <select
                      required
                      value={promotionData.tipo_aplicacion}
                      onChange={(e) => setPromotionData({ ...promotionData, tipo_aplicacion: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    >
                      <option value="general">General (Toda la tienda)</option>
                      <option value="categoria">Por Categoría</option>
                      <option value="producto">Por Producto</option>
                      <option value="talla">Por Talla</option>
                      <option value="color">Por Color</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descuento (%) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="10"
                      value={promotionData.descuento_porcentaje}
                      onChange={(e) => setPromotionData({ ...promotionData, descuento_porcentaje: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio *</label>
                    <input
                      type="date"
                      required
                      value={promotionData.fecha_inicio}
                      onChange={(e) => setPromotionData({ ...promotionData, fecha_inicio: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin *</label>
                    <input
                      type="date"
                      required
                      value={promotionData.fecha_fin}
                      onChange={(e) => setPromotionData({ ...promotionData, fecha_fin: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>

                  {promotionData.tipo_aplicacion === 'categoria' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                      <select
                        value={promotionData.id_categoria}
                        onChange={(e) => setPromotionData({ ...promotionData, id_categoria: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      >
                        <option value="">Seleccionar categoría</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>{category.nombre}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {promotionData.tipo_aplicacion === 'talla' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Talla</label>
                      <select
                        value={promotionData.talla_objetivo}
                        onChange={(e) => setPromotionData({ ...promotionData, talla_objetivo: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      >
                        <option value="">Seleccionar talla</option>
                        {tallas.map(talla => (
                          <option key={talla} value={talla}>{talla}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {promotionData.tipo_aplicacion === 'color' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                      <select
                        value={promotionData.color_objetivo}
                        onChange={(e) => setPromotionData({ ...promotionData, color_objetivo: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      >
                        <option value="">Seleccionar color</option>
                        {colores.map(color => (
                          <option key={color} value={color}>{color}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    placeholder="Describe los detalles de la promoción..."
                    value={promotionData.descripcion}
                    onChange={(e) => setPromotionData({ ...promotionData, descripcion: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Plus size={18} />
                        {promotion ? 'Actualizar Promoción' : 'Crear Promoción'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, promotionTitle }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
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
              ¿Eliminar Promoción?
            </h3>
            
            <p className="text-gray-600 text-center mb-6">
              ¿Estás seguro de que deseas eliminar la promoción <span className="font-medium">{promotionTitle}</span>? 
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

const Coupons = () => {
  const [coupons, setCoupons] = useState([
    {
      id: "1",
      code: "ALPACA20",
      type: "percentage",
      value: 20,
      minAmount: 100,
      maxDiscount: 50,
      usageLimit: 100,
      usedCount: 23,
      expiresAt: "2024-12-31",
      isActive: true,
      createdAt: "2024-01-15",
      description: "Descuento especial en productos de alpaca"
    },
    {
      id: "2",
      code: "WELCOME10",
      type: "fixed",
      value: 10,
      usageLimit: 500,
      usedCount: 156,
      expiresAt: "2024-06-30",
      isActive: true,
      createdAt: "2024-01-10",
      description: "Cupón de bienvenida"
    },
    {
      id: "3",
      code: "MASTERCARD_AUTO_2025",
      type: "percentage",
      value: 5,
      usageLimit: 1000,
      usedCount: 45,
      expiresAt: "2025-12-31",
      isActive: true,
      createdAt: "2025-01-01",
      description: "Descuento automático para tarjetas Mastercard"
    }
  ]);

  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promotionsLoading, setPromotionsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('coupons');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showCouponForm, setShowCouponForm] = useState(false);
  const [showPromotionForm, setShowPromotionForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    type: "percentage",
    value: "",
    minAmount: "",
    maxDiscount: "",
    usageLimit: "",
    expiresAt: "",
    description: ""
  });

  const [newPromotion, setNewPromotion] = useState({
    titulo: "",
    descripcion: "",
    descuento_porcentaje: "",
    fecha_inicio: "",
    fecha_fin: "",
    tipo_aplicacion: "general",
    id_producto: "",
    id_categoria: "",
    talla_objetivo: "",
    color_objetivo: ""
  });

  useEffect(() => {
    setLoading(false);
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setPromotionsLoading(true);
      const response = await axios.get(
        'http://localhost:3000/admin/promotions',
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.success && response.data.data) {
        setPromotions(response.data.data);
      } else {
        setPromotions([]);
      }
    } catch (error) {
      console.error('Error fetching promotions:', error);
      setError('Error al cargar las promociones');
      setTimeout(() => setError(''), 3000);
      setPromotions([
        {
          id: "1",
          titulo: "Descuento Talla XS",
          descripcion: "Descuento especial del 10% para productos talla XS",
          descuento_porcentaje: 10.00,
          fecha_inicio: "2025-01-01",
          fecha_fin: "2025-12-31",
          tipo_aplicacion: "talla",
          talla_objetivo: "XS",
          color_objetivo: null,
          id_producto: null,
          id_categoria: null,
          activo: true,
          fecha_creacion: "2025-01-01"
        }
      ]);
    } finally {
      setPromotionsLoading(false);
    }
  };

  const createPromotion = async (promotionData) => {
    try {
      setPromotionsLoading(true);
      const response = await axios.post(
        'http://localhost:3000/admin/crear_promotions',
        promotionData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccess('Promoción creada exitosamente');
        setTimeout(() => setSuccess(''), 3000);
        await fetchPromotions(); 
        return true;
      }
    } catch (error) {
      console.error('Error creating promotion:', error);
      setError(error.response?.data?.message || 'Error al crear la promoción');
      setTimeout(() => setError(''), 3000);
      return false;
    } finally {
      setPromotionsLoading(false);
    }
  };

  const editPromotion = async (promotionId, promotionData) => {
    try {
      setPromotionsLoading(true);
      const response = await axios.put(
        `http://localhost:3000/admin/edit_promotions/${promotionId}`,
        promotionData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccess('Promoción actualizada exitosamente');
        setTimeout(() => setSuccess(''), 3000);
        await fetchPromotions(); 
        return true;
      }
    } catch (error) {
      console.error('Error updating promotion:', error);
      setError(error.response?.data?.message || 'Error al actualizar la promoción');
      setTimeout(() => setError(''), 3000);
      return false;
    } finally {
      setPromotionsLoading(false);
    }
  };

  const stats = [
    { title: 'Total Cupones', value: coupons.length.toString(), icon: Tag, color: 'bg-blue-100 text-blue-600' },
    { title: 'Cupones Activos', value: coupons.filter(c => c.isActive).length.toString(), icon: CheckCircle, color: 'bg-green-100 text-green-600' },
    { title: 'Promociones Activas', value: Array.isArray(promotions) ? promotions.filter(p => p.activo).length.toString() : '0', icon: Gift, color: 'bg-purple-100 text-purple-600' },
    { title: 'Usos Totales', value: coupons.reduce((sum, c) => sum + c.usedCount, 0).toString(), icon: Clock, color: 'bg-orange-100 text-orange-600' },
  ];

  const statuses = [
    { id: 'all', label: 'Todos' },
    { id: 'active', label: 'Activos' },
    { id: 'expired', label: 'Expirados' },
  ];

  const categories = [
    { id: 1, nombre: "Abrigo" },
    { id: 2, nombre: "Saco" },
    { id: 3, nombre: "Casaca" },
    { id: 4, nombre: "Sueter" },
    { id: 5, nombre: "Cardigan" },
    { id: 6, nombre: "Chaleco" },
    { id: 7, nombre: "Poncho" },
    { id: 8, nombre: "Capa" },
    { id: 9, nombre: "Estola" },
    { id: 10, nombre: "Gorro" },
    { id: 11, nombre: "Guantes" },
    { id: 12, nombre: "Llavero" },
    { id: 13, nombre: "Peluche" },
    { id: 14, nombre: "Manta" }
  ];

  const tallas = ["XS", "S", "M", "L", "XL"];
  const colores = ["BEIGE", "GRIS", "CAMEL", "AZUL", "VERDE", "NEGRO", "ROSADO", "FUCSIA", "ECRU"];

  const handleCreateCoupon = () => {
    if (!newCoupon.code || !newCoupon.value) return;

    const coupon = {
      id: Date.now().toString(),
      code: newCoupon.code.toUpperCase(),
      type: newCoupon.type,
      value: parseFloat(newCoupon.value),
      minAmount: newCoupon.minAmount ? parseFloat(newCoupon.minAmount) : undefined,
      maxDiscount: newCoupon.maxDiscount ? parseFloat(newCoupon.maxDiscount) : undefined,
      usageLimit: newCoupon.usageLimit ? parseInt(newCoupon.usageLimit) : undefined,
      usedCount: 0,
      expiresAt: newCoupon.expiresAt,
      isActive: true,
      createdAt: new Date().toISOString().split("T")[0],
      description: newCoupon.description
    };

    setCoupons([...coupons, coupon]);
    setNewCoupon({
      code: "",
      type: "percentage",
      value: "",
      minAmount: "",
      maxDiscount: "",
      usageLimit: "",
      expiresAt: "",
      description: ""
    });
    setShowCouponForm(false);
  };

  const handleCreatePromotion = async () => {
    if (!newPromotion.titulo || !newPromotion.descuento_porcentaje || !newPromotion.fecha_inicio || !newPromotion.fecha_fin) {
      setError('Por favor completa todos los campos obligatorios');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const promotionData = {
      titulo: newPromotion.titulo,
      descripcion: newPromotion.descripcion,
      descuento_porcentaje: parseFloat(newPromotion.descuento_porcentaje),
      fecha_inicio: newPromotion.fecha_inicio,
      fecha_fin: newPromotion.fecha_fin,
      tipo_aplicacion: newPromotion.tipo_aplicacion,
      id_producto: newPromotion.id_producto ? parseInt(newPromotion.id_producto) : 0,
      id_categoria: newPromotion.id_categoria ? parseInt(newPromotion.id_categoria) : 0,
      talla_objetivo: newPromotion.talla_objetivo || "",
      color_objetivo: newPromotion.color_objetivo || ""
    };

    const success = await createPromotion(promotionData);
    
    if (success) {
      setNewPromotion({
        titulo: "",
        descripcion: "",
        descuento_porcentaje: "",
        fecha_inicio: "",
        fecha_fin: "",
        tipo_aplicacion: "general",
        id_producto: "",
        id_categoria: "",
        talla_objetivo: "",
        color_objetivo: ""
      });
      setShowPromotionForm(false);
    }
  };

  const toggleCouponStatus = (id) => {
    setCoupons(coupons.map((coupon) => 
      coupon.id === id ? { ...coupon, isActive: !coupon.isActive } : coupon
    ));
  };

  const togglePromotionStatus = async (id) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/admin/promotions/${id}/toggle`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setSuccess('Estado de promoción actualizado');
        setTimeout(() => setSuccess(''), 3000);
        await fetchPromotions(); // Recargar promociones
      }
    } catch (error) {
      console.error('Error toggling promotion status:', error);
      setError(error.response?.data?.message || 'Error al cambiar el estado de la promoción');
      setTimeout(() => setError(''), 3000);
    }
  };

  const deleteCoupon = (id) => {
    setCoupons(coupons.filter((coupon) => coupon.id !== id));
  };

  const deletePromotion = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/admin/promotions/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setSuccess('Promoción eliminada exitosamente');
        setTimeout(() => setSuccess(''), 3000);
        await fetchPromotions(); // Recargar promociones
      }
    } catch (error) {
      console.error('Error deleting promotion:', error);
      setError(error.response?.data?.message || 'Error al eliminar la promoción');
      setTimeout(() => setError(''), 3000);
    }
  };

  const openEditModal = async (promotion) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/admin/promotions/get/${promotion.id_promociones}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.status === 200) {
        setEditingPromotion(response.data);
      }
    } catch (error) {
      console.error('Error al obtener datos de la promoción:', error);
      setError('Error al cargar los datos de la promoción');
      setTimeout(() => setError(''), 3000);
    }
  };

  const closeEditModal = () => {
    setEditingPromotion(null);
  };

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         coupon.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && coupon.isActive) ||
                         (statusFilter === 'expired' && !coupon.isActive);
    return matchesSearch && matchesStatus;
  });

  const getTipoAplicacionLabel = (tipo) => {
    switch (tipo) {
      case 'producto': return 'Por Producto';
      case 'categoria': return 'Por Categoría';
      case 'talla': return 'Por Talla';
      case 'color': return 'Por Color';
      case 'general': return 'General';
      default: return tipo;
    }
  };

  const getTipoAplicacionColor = (tipo) => {
    switch (tipo) {
      case 'producto': return 'bg-blue-100 text-blue-800';
      case 'categoria': return 'bg-green-100 text-green-800';
      case 'talla': return 'bg-purple-100 text-purple-800';
      case 'color': return 'bg-orange-100 text-orange-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Gestión de Cupones y Promociones</h1>
      </div>

      {/* Mensajes de Error y Success */}
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
          <div className="text-sm text-green-600">
            {success}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('coupons')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'coupons'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Tag size={18} />
                Cupones de Descuento
              </div>
            </button>
            <button
              onClick={() => setActiveTab('promotions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'promotions'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Gift size={18} />
                Promociones de Temporada
              </div>
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Buscar cupones..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {statuses.map((status) => (
                  <button
                    key={status.id}
                    onClick={() => setStatusFilter(status.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === status.id
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {showCouponForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Plus size={20} />
                Crear Nuevo Cupón
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código del Cupón</label>
                  <input
                    type="text"
                    placeholder="ALPACA25"
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Descuento</label>
                  <select
                    value={newCoupon.type}
                    onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option value="percentage">Porcentaje (%)</option>
                    <option value="fixed">Monto Fijo (S/)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor {newCoupon.type === "percentage" ? "(%)" : "(S/)"}
                  </label>
                  <input
                    type="number"
                    placeholder={newCoupon.type === "percentage" ? "20" : "10"}
                    value={newCoupon.value}
                    onChange={(e) => setNewCoupon({ ...newCoupon, value: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Compra Mínima (S/)</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={newCoupon.minAmount}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minAmount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descuento Máximo (S/)</label>
                  <input
                    type="number"
                    placeholder="50"
                    value={newCoupon.maxDiscount}
                    onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Límite de Uso</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={newCoupon.usageLimit}
                    onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Expiración</label>
                  <input
                    type="date"
                    value={newCoupon.expiresAt}
                    onChange={(e) => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    placeholder="Descripción del cupón..."
                    value={newCoupon.description}
                    onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleCreateCoupon}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <Plus size={18} />
                  Crear Cupón
                </button>
                <button
                  onClick={() => setShowCouponForm(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          )}

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Cupones Existentes</h3>
              <button
                onClick={() => setShowCouponForm(!showCouponForm)}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                {showCouponForm ? 'Ocultar Formulario' : 'Crear Cupón'}
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCoupons.map((coupon, index) => (
                  <motion.div
                    key={coupon.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-lg p-4 border"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${
                          coupon.type === 'percentage' ? 'bg-blue-100' : 'bg-green-100'
                        }`}>
                          {coupon.type === 'percentage' ? (
                            <Percent size={16} className="text-blue-600" />
                          ) : (
                            <DollarSign size={16} className="text-green-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 font-mono">{coupon.code}</h4>
                          <p className="text-sm text-gray-600">{coupon.description}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        coupon.isActive 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {coupon.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Descuento:</span>
                        <span className="font-semibold text-gray-900">
                          {coupon.type === 'percentage' 
                            ? `${coupon.value}%`
                            : `S/ ${coupon.value}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Usos:</span>
                        <span className="font-semibold text-gray-900">
                          {coupon.usedCount} / {coupon.usageLimit || '∞'}
                        </span>
                      </div>
                      {coupon.minAmount && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Compra mín:</span>
                          <span className="font-semibold text-gray-900">S/ {coupon.minAmount}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={14} />
                        <span>Expira: {new Date(coupon.expiresAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end gap-2">
                      <button
                        onClick={() => toggleCouponStatus(coupon.id)}
                        className={`px-2 py-1 text-xs rounded ${
                          coupon.isActive 
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {coupon.isActive ? 'Desactivar' : 'Activar'}
                      </button>
                      <button
                        onClick={() => deleteCoupon(coupon.id)}
                        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'promotions' && (
        <div className="space-y-6">
          {showPromotionForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Plus size={20} />
                Crear Nueva Promoción
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título de la Promoción</label>
                  <input
                    type="text"
                    placeholder="Descuento Talla XS"
                    value={newPromotion.titulo}
                    onChange={(e) => setNewPromotion({ ...newPromotion, titulo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Aplicación</label>
                  <select
                    value={newPromotion.tipo_aplicacion}
                    onChange={(e) => setNewPromotion({ ...newPromotion, tipo_aplicacion: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option value="general">General (Toda la tienda)</option>
                    <option value="categoria">Por Categoría</option>
                    <option value="producto">Por Producto</option>
                    <option value="talla">Por Talla</option>
                    <option value="color">Por Color</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descuento (%)</label>
                  <input
                    type="number"
                    placeholder="10"
                    value={newPromotion.descuento_porcentaje}
                    onChange={(e) => setNewPromotion({ ...newPromotion, descuento_porcentaje: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
                  <input
                    type="date"
                    value={newPromotion.fecha_inicio}
                    onChange={(e) => setNewPromotion({ ...newPromotion, fecha_inicio: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin</label>
                  <input
                    type="date"
                    value={newPromotion.fecha_fin}
                    onChange={(e) => setNewPromotion({ ...newPromotion, fecha_fin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>

                {newPromotion.tipo_aplicacion === 'categoria' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                    <select
                      value={newPromotion.id_categoria}
                      onChange={(e) => setNewPromotion({ ...newPromotion, id_categoria: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    >
                      <option value="">Seleccionar categoría</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.nombre}</option>
                      ))}
                    </select>
                  </div>
                )}

                {newPromotion.tipo_aplicacion === 'talla' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Talla</label>
                    <select
                      value={newPromotion.talla_objetivo}
                      onChange={(e) => setNewPromotion({ ...newPromotion, talla_objetivo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    >
                      <option value="">Seleccionar talla</option>
                      {tallas.map(talla => (
                        <option key={talla} value={talla}>{talla}</option>
                      ))}
                    </select>
                  </div>
                )}

                {newPromotion.tipo_aplicacion === 'color' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <select
                      value={newPromotion.color_objetivo}
                      onChange={(e) => setNewPromotion({ ...newPromotion, color_objetivo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    >
                      <option value="">Seleccionar color</option>
                      {colores.map(color => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    placeholder="Describe los detalles de la promoción..."
                    value={newPromotion.descripcion}
                    onChange={(e) => setNewPromotion({ ...newPromotion, descripcion: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleCreatePromotion}
                  disabled={promotionsLoading}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={18} />
                  {promotionsLoading ? 'Creando...' : 'Crear Promoción'}
                </button>
                <button
                  onClick={() => setShowPromotionForm(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          )}

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Promociones de Temporada</h3>
              <button
                onClick={() => setShowPromotionForm(!showPromotionForm)}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                {showPromotionForm ? 'Ocultar Formulario' : 'Crear Promoción'}
              </button>
            </div>
            
            {promotionsLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {Array.isArray(promotions) && promotions.map((promotion, index) => (
                  <motion.div
                    key={promotion.id_promociones}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{promotion.titulo}</h4>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          promotion.activo 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {promotion.activo ? 'Activa' : 'Inactiva'}
                        </span>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full flex items-center gap-1">
                          <Percent size={12} />
                          {promotion.descuento_porcentaje}%
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getTipoAplicacionColor(promotion.tipo_aplicacion)}`}>
                          {getTipoAplicacionLabel(promotion.tipo_aplicacion)}
                        </span>
                        {promotion.talla_objetivo && (
                          <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                            Talla: {promotion.talla_objetivo}
                          </span>
                        )}
                        {promotion.color_objetivo && (
                          <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                            Color: {promotion.color_objetivo}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{promotion.descripcion}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(promotion.fecha_inicio).toLocaleDateString()} - {new Date(promotion.fecha_fin).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(promotion)}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        <Edit size={12} />
                      </button>
                      <button
                        onClick={() => togglePromotionStatus(promotion.id_promociones)}
                        className={`px-2 py-1 text-xs rounded ${
                          promotion.activo 
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {promotion.activo ? 'Desactivar' : 'Activar'}
                      </button>
                      <button
                        onClick={() => deletePromotion(promotion.id_promociones)}
                        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {editingPromotion && (
        <EditPromotionModal
          isOpen={!!editingPromotion}
          onClose={closeEditModal}
          promotion={editingPromotion}
          onUpdate={fetchPromotions}
          editPromotion={editPromotion}
        />
      )}
    </div>
  );
};

export default Coupons;