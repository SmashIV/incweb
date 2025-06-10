import React, { useState, useEffect } from 'react';
import { Tag, Plus, Search, Calendar, Percent, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // TODO: Fetch coupons from API
    setLoading(false);
  }, []);

  const stats = [
    { title: 'Total Cupones', value: '45', icon: Tag, color: 'bg-blue-100 text-blue-600' },
    { title: 'Activos', value: '32', icon: CheckCircle, color: 'bg-green-100 text-green-600' },
    { title: 'Expirados', value: '8', icon: XCircle, color: 'bg-red-100 text-red-600' },
    { title: 'Usos Totales', value: '1,234', icon: Clock, color: 'bg-purple-100 text-purple-600' },
  ];

  const statuses = [
    { id: 'all', label: 'Todos' },
    { id: 'active', label: 'Activos' },
    { id: 'expired', label: 'Expirados' },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Gestión de Cupones</h1>
        <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
          <Plus size={18} />
          Crear Cupón
        </button>
      </div>

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

      <div className="bg-white rounded-lg shadow p-4 mb-6">
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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((coupon, index) => (
            <motion.div
              key={coupon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${
                      coupon.type === 'percentage' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {coupon.type === 'percentage' ? (
                        <Percent size={20} className="text-blue-600" />
                      ) : (
                        <DollarSign size={20} className="text-green-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{coupon.code}</h3>
                      <p className="text-sm text-gray-600">{coupon.description}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    coupon.active 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {coupon.active ? 'Activo' : 'Expirado'}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Descuento:</span>
                    <span className="font-semibold text-gray-900">
                      {coupon.type === 'percentage' 
                        ? `${coupon.discount}%`
                        : `S/ ${coupon.discount}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Usos:</span>
                    <span className="font-semibold text-gray-900">
                      {coupon.uses} / {coupon.maxUses || '∞'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>Válido hasta {coupon.expiryDate}</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
                    Editar
                  </button>
                  <button className="px-3 py-1 text-sm text-red-600 hover:text-red-900">
                    Eliminar
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Coupons;