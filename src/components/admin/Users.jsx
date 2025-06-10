import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, UserPlus, Mail, Phone, Calendar, Shield, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    // TODO: Fetch users from API
    setLoading(false);
  }, []);

  const stats = [
    { title: 'Total Usuarios', value: '1,234', icon: UsersIcon, color: 'bg-blue-100 text-blue-600' },
    { title: 'Nuevos Hoy', value: '12', icon: UserPlus, color: 'bg-green-100 text-green-600' },
    { title: 'Clientes', value: '1,200', icon: Shield, color: 'bg-purple-100 text-purple-600' },
    { title: 'Administradores', value: '34', icon: Shield, color: 'bg-yellow-100 text-yellow-600' },
  ];

  const roles = [
    { id: 'all', label: 'Todos' },
    { id: 'cliente', label: 'Clientes' },
    { id: 'admin', label: 'Administradores' },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Gestión de Usuarios</h1>
        <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
          <UserPlus size={18} />
          Nuevo Usuario
        </button>
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
                placeholder="Buscar usuarios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
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

      {/* Users Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user, index) => (
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
                    <UserPlus size={24} className="text-gray-600" />
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
                    <span>Registrado el {user.registrationDate}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'admin' 
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                  <button className="text-sm text-gray-600 hover:text-gray-900">
                    Ver detalles
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

export default Users;