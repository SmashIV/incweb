import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, FileText, Clock, Package, ArrowLeft, Phone, MapPin } from 'lucide-react';
import axios from 'axios';

const OrderConfirmation = () => {
  const { id_pedido } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (!id_pedido || id_pedido === 'undefined') {
          setError('ID de pedido no válido.');
          setLoading(false);
          return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
          setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/admin/orders/${id_pedido}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data) {
          setOrderDetails(response.data);
        }
      } catch (error) {
        console.error('Error al obtener detalles del pedido:', error);
        setError('Error al cargar los detalles del pedido.');
      } finally {
        setLoading(false);
      }
    };

    if (id_pedido) {
      fetchOrderDetails();
    } else {
      setError('ID de pedido no válido.');
      setLoading(false);
    }
  }, [id_pedido]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'S/ 0.00';
    return `S/ ${parseFloat(amount).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5C2A] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando confirmación...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-[#8B5C2A] text-white px-6 py-2 rounded-lg hover:bg-[#C19A6B] transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Pedido Confirmado!
          </h1>
          <p className="text-gray-600 text-lg">
            Tu pedido #{id_pedido} ha sido procesado exitosamente
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package size={24} className="text-[#8B5C2A]" />
                Detalles del Pedido
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-500">Número de Pedido</span>
                  <p className="font-semibold text-gray-900">#{id_pedido}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Fecha de Orden</span>
                  <p className="font-semibold text-gray-900">
                    {formatDate(orderDetails?.fecha_orden)}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Estado</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                    <CheckCircle size={16} className="mr-1" />
                    Pagado
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Total Pagado</span>
                  <p className="font-bold text-xl text-[#8B5C2A]">
                    {formatCurrency(orderDetails?.total_pago)}
                  </p>
                </div>
              </div>

              {orderDetails?.promociones_aplicadas && orderDetails.promociones_aplicadas.trim() && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Promociones Aplicadas</h3>
                  <div className="flex flex-wrap gap-2">
                    {orderDetails.promociones_aplicadas.split(',').map((promo, idx) => (
                      <span key={idx} className="px-3 py-1 text-sm rounded bg-green-100 text-green-800 font-semibold border border-green-200">
                        {promo.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {orderDetails?.products && orderDetails.products.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Productos</h3>
                  <div className="space-y-3">
                    {orderDetails.products.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package size={20} className="text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.product_name}</p>
                          <p className="text-sm text-gray-600">
                            Cantidad: {item.cantidad} | Talla: {item.talla || 'N/A'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(item.precio * item.cantidad)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={24} className="text-[#8B5C2A]" />
                Información de Envío
              </h2>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Dirección</span>
                  <p className="font-medium text-gray-900">
                    {orderDetails?.shipping_address || 'Dirección no disponible'}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Distrito</span>
                    <p className="font-medium text-gray-900">
                      {orderDetails?.shipping_district || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Ciudad</span>
                    <p className="font-medium text-gray-900">
                      {orderDetails?.shipping_city || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Próximos Pasos</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail size={20} className="text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Revisa tu Email</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Hemos enviado la confirmación y boleta electrónica a tu correo electrónico.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <FileText size={20} className="text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Boleta Electrónica</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      La boleta electrónica estará disponible en tu email en los próximos minutos.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Clock size={20} className="text-yellow-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Tiempo de Envío</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Tu pedido será procesado y enviado en 1-3 días hábiles.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">¿Necesitas Ayuda?</h2>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-[#8B5C2A]" />
                  <div>
                    <p className="font-medium text-gray-900">Soporte al Cliente</p>
                    <p className="text-sm text-gray-600">+51 999 999 999</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-[#8B5C2A]" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">soporte@incalpaca.com</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Horario de atención: Lunes a Viernes de 9:00 AM a 6:00 PM
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/')}
                className="w-full bg-[#8B5C2A] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#C19A6B] transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft size={20} />
                Continuar Comprando
              </button>
              
              <button
                onClick={() => navigate('/cart')}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Ver Carrito
              </button>
            </div>
          </motion.div>
        </div>

        {/* Footer informativo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6"
        >
          <div className="text-center">
            <h3 className="font-bold text-blue-900 mb-2">¡Gracias por tu compra!</h3>
            <p className="text-blue-700">
              Tu pedido ha sido procesado exitosamente. Recibirás actualizaciones sobre el estado de tu envío por email.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation; 