import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Package, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Search, 
  Grid, 
  List, 
  User, 
  MapPin, 
  CreditCard, 
  X, 
  CheckCircle as CheckCircleIcon,
  Calendar,
  DollarSign,
  ShoppingBag,
  BarChart3,
  Airplay,
  Download,
  Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { auth } from '../../config/firebase';

const OrderDetailModal = ({ isOpen, onClose, order, userInfo, loadingUserInfo }) => {
  if (!order) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendiente': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'pagado': return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelado': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pendiente': return <Clock size={20} />;
      case 'pagado': return <CheckCircle size={20} />;
      case 'cancelado': return <AlertCircle size={20} />;
      default: return <Package size={20} />;
    }
  };

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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative border border-gray-200"
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[20rem] font-mono text-gray-50 select-none">ORD</span>
            </div>
            <div className="relative z-10 p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900">
                    <Package size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-mono font-bold text-gray-900">
                      ORDER_DETAILS: #{order.id_pedido}
                    </h2>
                    <p className="text-sm font-mono text-gray-500">Terminal v1.0.0</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>



              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-mono font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <User size={20} className="text-gray-600" />
                      CUSTOMER_INFO
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-mono text-gray-500 mb-1 uppercase tracking-wide">FIREBASE_UID</label>
                        <p className="text-sm font-mono text-gray-900 bg-white p-2 rounded border border-gray-200">{order.firebase_uid || 'N/A'}</p>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-mono text-gray-500 mb-1 uppercase tracking-wide">EMAIL</label>
                        <p className="text-sm font-mono text-gray-900 bg-white p-2 rounded border border-gray-200">{order.customer_email || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-gray-500 mb-1 uppercase tracking-wide">PHONE</label>
                        <p className="text-sm font-mono text-gray-900 bg-white p-2 rounded border border-gray-200">{order.customer_phone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-mono font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin size={20} className="text-gray-600" />
                      SHIPPING_ADDRESS
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-mono text-gray-500 mb-1 uppercase tracking-wide">ADDRESS</label>
                        <p className="text-sm font-mono text-gray-900 bg-white p-2 rounded border border-gray-200">{order.shipping_address || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-gray-500 mb-1 uppercase tracking-wide">DISTRICT</label>
                        <p className="text-sm font-mono text-gray-900 bg-white p-2 rounded border border-gray-200">{order.shipping_district || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-gray-500 mb-1 uppercase tracking-wide">CITY</label>
                        <p className="text-sm font-mono text-gray-900 bg-white p-2 rounded border border-gray-200">{order.shipping_city || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-gray-500 mb-1 uppercase tracking-wide">POSTAL_CODE</label>
                        <p className="text-sm font-mono text-gray-900 bg-white p-2 rounded border border-gray-200">{order.shipping_postal_code || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-mono font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <ShoppingBag size={20} className="text-gray-600" />
                      ORDER_STATUS
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 text-sm font-mono font-bold rounded-lg border ${getStatusColor(order.estado)}`}>
                          {order.estado?.toUpperCase() || 'N/A'}
                        </span>
                        {getStatusIcon(order.estado)}
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-gray-500 mb-1 uppercase tracking-wide">PAYMENT_METHOD</label>
                        <p className="text-sm font-mono text-gray-900 bg-white p-2 rounded border border-gray-200">{order.payment_method || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-gray-500 mb-1 uppercase tracking-wide">ORDER_DATE</label>
                        <p className="text-sm font-mono text-gray-900 bg-white p-2 rounded border border-gray-200">{formatDate(order.fecha_orden)}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-gray-500 mb-1 uppercase tracking-wide">TOTAL_ITEMS</label>
                        <p className="text-sm font-mono text-gray-900 bg-white p-2 rounded border border-gray-200">{order.cantidad_total_productos || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-mono font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <DollarSign size={20} className="text-gray-600" />
                      PRODUCTS
                    </h3>
                    <div className="space-y-3">
                      {(order.products || []).map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                          <div>
                            <p className="text-sm font-mono text-gray-900">{item.product_name || 'N/A'}</p>
                            <p className="text-xs font-mono text-gray-500">QTY: {item.cantidad || 0} | SIZE: {item.talla || 'N/A'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-mono text-gray-900">{formatCurrency(item.precio)}</p>
                            <p className="text-xs font-mono text-gray-500">TOTAL: {formatCurrency(item.precio * item.cantidad)}</p>
                          </div>
                        </div>
                      ))}
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-mono font-bold text-gray-900">TOTAL</span>
                          <span className="text-lg font-mono font-bold text-gray-900">{formatCurrency(order.total_pago)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {order.payment_info && (
                <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-mono font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard size={20} className="text-gray-600" />
                    PAYMENT_INFO
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-gray-500 mb-1 uppercase tracking-wide">PAYMENT_STATUS</label>
                      <p className="text-sm font-mono text-gray-900 bg-white p-2 rounded border border-gray-200">{order.payment_info.estado_pago || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-500 mb-1 uppercase tracking-wide">PAYMENT_METHOD</label>
                      <p className="text-sm font-mono text-gray-900 bg-white p-2 rounded border border-gray-200">{order.payment_info.mp_payment_method_id || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-500 mb-1 uppercase tracking-wide">PAYMENT_DATE</label>
                      <p className="text-sm font-mono text-gray-900 bg-white p-2 rounded border border-gray-200">{formatDate(order.payment_info.fecha_pago)}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-500 mb-1 uppercase tracking-wide">MP_PAYMENT_ID</label>
                      <p className="text-sm font-mono text-gray-900 bg-white p-2 rounded border border-gray-200">{order.payment_info.mp_payment_id || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}



              <div className="mt-8 flex justify-end gap-4">
                <button
                  onClick={onClose}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors font-mono font-bold border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  CLOSE
                </button>
                <button className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-mono font-bold border border-gray-700">
                  UPDATE_STATUS
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const getUserInfo = async (firebase_uid) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.warn('No hay usuario autenticado');
      return firebase_uid;
    }

    const idToken = await currentUser.getIdToken();
    
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/projects/incalpacautp/accounts:lookup?key=${import.meta.env.VITE_FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({
        localId: firebase_uid
      })
    });

    if (!response.ok) {
      throw new Error('Error al obtener datos de Firebase');
    }

    const data = await response.json();
    
    if (data.users && data.users.length > 0) {
      const user = data.users[0];
      return user.displayName || user.email || firebase_uid;
    } else {
      return firebase_uid;
    }
  } catch (error) {
    console.error('Error al obtener información del usuario:', error);
    return firebase_uid;
  }
};

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [userInfo, setUserInfo] = useState({}); // Cache de información de usuarios
  const [loadingUserInfo, setLoadingUserInfo] = useState(false);

  const statuses = [
    { id: 'all', label: 'TODOS' },
    { id: 'pendiente', label: 'PENDIENTES' },
    { id: 'pagado', label: 'PAGADOS' },
    { id: 'cancelado', label: 'CANCELADOS' },
  ];

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/admin/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Campos de las órdenes:', response.data[0]);
      console.log('Total orders from backend:', response.data.length);
      console.log('Orders data:', response.data);
      setOrders(response.data);
      await loadUserInfo(response.data);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/admin/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error al cargar detalles del pedido:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const stats = useMemo(() => {
    const total = orders.length;
    const pendientes = orders.filter(order => order.estado === 'pendiente').length;
    const pagados = orders.filter(order => order.estado === 'pagado').length;
    const cancelados = orders.filter(order => order.estado === 'cancelado').length;
    const totalRevenue = orders
      .filter(order => order.estado === 'pagado')
      .reduce((sum, order) => sum + parseFloat(order.total_pago), 0);

    return {
      total,
      pendientes,
      pagados,
      cancelados,
      totalRevenue
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        (order.id_pedido?.toString() || '').includes(searchTerm.toLowerCase()) ||
        (order.firebase_uid?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (userInfo[order.firebase_uid]?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (order.total_pago?.toString() || '').includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === 'all' || order.estado === selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, selectedStatus, userInfo]);

  const handleViewOrder = async (order) => {
    const orderDetails = await fetchOrderDetails(order.id_pedido);
    setSelectedOrder(orderDetails);
    setIsDetailModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendiente': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'pagado': return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelado': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'S/ 0.00';
    return `S/ ${parseFloat(amount).toFixed(2)}`;
  };

  // Función para cargar información de todos los usuarios
  const loadUserInfo = async (ordersList) => {
    setLoadingUserInfo(true);
    try {
      const uniqueUids = [...new Set(ordersList.map(order => order.firebase_uid).filter(Boolean))];
      const userInfoPromises = uniqueUids.map(async (uid) => {
        const info = await getUserInfo(uid);
        return { uid, info };
      });
      
      const userInfoResults = await Promise.all(userInfoPromises);
      const userInfoMap = {};
      userInfoResults.forEach(({ uid, info }) => {
        userInfoMap[uid] = info;
      });
      
      setUserInfo(userInfoMap);
    } catch (error) {
      console.error('Error al cargar información de usuarios:', error);
    } finally {
      setLoadingUserInfo(false);
    }
  };

  const exportOrdersToCSV = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/admin/orders/export-csv', {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `pedidos_incalpaca_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al exportar CSV:', error);
      alert('Error al exportar el archivo CSV. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900">
            <ShoppingCart size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-mono font-bold text-gray-900">ORDERS_MANAGEMENT</h1>
            <p className="text-sm font-mono text-gray-500">Terminal v1.0.0 - System Status: ONLINE</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportOrdersToCSV}
            className="bg-green-600 hover:bg-green-700 text-white font-mono font-bold py-3 px-6 rounded-lg flex items-center gap-2 border border-green-700 transition-colors"
          >
            <Download size={20} />
            EXPORT_CSV
          </button>
          <button 
            onClick={() => navigate('/admin/analytics')}
            className="bg-gray-900 hover:bg-gray-800 text-white font-mono font-bold py-3 px-6 rounded-lg flex items-center gap-2 border border-gray-700 transition-colors"
          >
            <BarChart3 size={20} />
            ANALYTICS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-mono text-gray-500 uppercase tracking-wide">TOTAL_ORDERS</p>
              <p className="text-3xl font-mono font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <ShoppingCart size={24} className="text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-mono text-gray-500 uppercase tracking-wide">PENDING</p>
              <p className="text-3xl font-mono font-bold text-gray-900">{stats.pendientes}</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <Clock size={24} className="text-yellow-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-mono text-gray-500 uppercase tracking-wide">COMPLETED</p>
              <p className="text-3xl font-mono font-bold text-gray-900">{stats.pagados}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-mono text-gray-500 uppercase tracking-wide">REVENUE</p>
              <p className="text-3xl font-mono font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
              <DollarSign size={24} className="text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="SEARCH: order_id, customer_name, tracking_number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 font-mono text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {statuses.map((status) => (
              <button
                key={status.id}
                onClick={() => setSelectedStatus(status.id)}
                className={`px-4 py-3 rounded-lg text-sm font-mono font-bold transition-colors border ${
                  selectedStatus === status.id
                    ? 'bg-gray-900 text-white border-gray-700'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200'
                }`}
              >
                {status.label}
              </button>
            ))}
            <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1 border border-gray-200">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid' ? 'bg-white shadow-sm border border-gray-200 scale-110' : ''
                }`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={20} className="text-gray-600" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'list' ? 'bg-white shadow-sm border border-gray-200 scale-110' : ''
                }`}
                onClick={() => setViewMode('list')}
              >
                <List size={20} className="text-gray-600" />
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
          {filteredOrders.map((order, index) => (
            <motion.div
              key={`grid-${order.id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                  <Package size={24} className="text-gray-600" />
                </div>
                <div>
                  <h3 className="font-mono font-bold text-gray-900">#{order.id_pedido}</h3>
                  <p className="text-sm font-mono text-gray-600">
                    {loadingUserInfo ? (
                      <span className="text-gray-400">Cargando...</span>
                    ) : (
                      userInfo[order.firebase_uid] || order.firebase_uid || 'N/A'
                    )}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm font-mono text-gray-600">
                  <Calendar size={16} />
                  <span>{formatDate(order.fecha_orden)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-mono text-gray-600">
                  <DollarSign size={16} />
                  <span>{formatCurrency(order.total_pago)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-mono text-gray-600">
                  <ShoppingBag size={16} />
                  <span>{order.cantidad_total_productos || 0} {(order.cantidad_total_productos || 0) === 1 ? 'ITEM' : 'ITEMS'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-mono text-gray-600">
                  <Airplay size={16} />
                  <span>{order.platform || 'N/A'}</span>
                </div>
              </div>
              
              {order.promociones_aplicadas && order.promociones_aplicadas.trim() && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {order.promociones_aplicadas.split(',').map((promo, idx) => (
                    <span key={idx} className="px-2 py-1 text-[10px] rounded bg-green-50 text-green-700 font-mono font-bold border border-green-200">{promo.trim()}</span>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 text-xs font-mono font-bold rounded-lg border ${getStatusColor(order.estado)}`}>
                  {order.estado?.toUpperCase() || 'N/A'}
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleViewOrder(order)}
                    className="text-sm font-mono text-gray-600 hover:text-gray-900 font-bold"
                  >
                    [VIEW]
                  </button>
                  <button 
                    className="text-blue-600 hover:text-blue-900 font-mono font-bold"
                  >
                    [EDIT]
                  </button>
                </div>
              </div>


            </motion.div>
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow-sm border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-mono font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">ORDER_ID</th>
                  <th className="px-6 py-4 text-left text-xs font-mono font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">CUSTOMER</th>
                  <th className="px-6 py-4 text-left text-xs font-mono font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">TOTAL</th>
                  <th className="px-6 py-4 text-left text-xs font-mono font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">STATUS</th>
                  <th className="px-6 py-4 text-left text-xs font-mono font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">DATE</th>
                  <th className="px-6 py-4 text-left text-xs font-mono font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">PLATFORM</th>
                  <th className="px-6 py-4 text-left text-xs font-mono font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">PROMOCIONES</th>
                  <th className="px-6 py-4 text-left text-xs font-mono font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order, index) => (
                  <tr key={`list-${order.id}-${index}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                          <Package size={16} className="text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-mono font-bold text-gray-900">#{order.id_pedido}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-mono font-bold text-gray-900">
                          {loadingUserInfo ? (
                            <span className="text-gray-400">Cargando...</span>
                          ) : (
                            userInfo[order.firebase_uid] || order.firebase_uid || 'N/A'
                          )}
                        </div>
                        <div className="text-sm font-mono text-gray-500">{order.cantidad_total_productos || 0} items</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono font-bold text-gray-900">{formatCurrency(order.total_pago)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-mono font-bold rounded-lg border ${getStatusColor(order.estado)}`}>
                        {order.estado?.toUpperCase() || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">{formatDate(order.fecha_orden)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">{order.platform || 'N/A'}</div>
                    </td>
                                         <td className="px-6 py-4 whitespace-nowrap">
                       {order.promociones_aplicadas && order.promociones_aplicadas.trim() ? (
                         <div className="flex flex-wrap gap-1">
                           {order.promociones_aplicadas.split(',').map((promo, idx) => (
                             <span key={idx} className="px-2 py-1 text-[10px] rounded bg-green-50 text-green-700 font-mono font-bold border border-green-200">{promo.trim()}</span>
                           ))}
                         </div>
                       ) : (
                         <span className="text-gray-400 text-xs">-</span>
                       )}
                     </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleViewOrder(order)}
                          className="text-gray-600 hover:text-gray-900 font-mono font-bold"
                        >
                          [VIEW]
                        </button>
                        <button 
                          className="text-blue-600 hover:text-blue-900 font-mono font-bold"
                        >
                          [EDIT]
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

      <OrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        userInfo={userInfo}
        loadingUserInfo={loadingUserInfo}
      />
    </div>
  );
};

export default Orders;