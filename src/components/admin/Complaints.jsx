import React, { useState, useEffect } from 'react';
import { AlertCircle, Search, Calendar, MessageSquare, User, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // TODO: Fetch complaints from API
    setLoading(false);
  }, []);

  const stats = [
    { title: 'Total Quejas', value: '156', icon: AlertCircle, color: 'bg-red-100 text-red-600' },
    { title: 'Pendientes', value: '23', icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
    { title: 'Resueltas', value: '133', icon: CheckCircle, color: 'bg-green-100 text-green-600' },
    { title: 'Tiempo Promedio', value: '2.5 días', icon: Calendar, color: 'bg-blue-100 text-blue-600' },
  ];

  const statuses = [
    { id: 'all', label: 'Todas' },
    { id: 'pending', label: 'Pendientes' },
    { id: 'resolved', label: 'Resueltas' },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Gestión de Quejas</h1>
      </div>

      {/* Stats Grid */}
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

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar quejas..."
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

      {/* Complaints Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint, index) => (
            <motion.div
              key={complaint.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <MessageSquare size={24} className="text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{complaint.subject}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User size={16} />
                        <span>{complaint.customer}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      complaint.status === 'resolved' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {complaint.status === 'resolved' ? 'Resuelta' : 'Pendiente'}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} />
                      <span>{complaint.date}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{complaint.message}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package size={16} />
                    <span>Pedido #{complaint.orderId}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
                      Ver Detalles
                    </button>
                    <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
                      Responder
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Complaints;