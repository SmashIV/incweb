import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Filter, Grid, List, Edit, Trash2, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // TODO: Fetch products from API
    setLoading(false);
  }, []);

  const stats = [
    { title: 'Total Productos', value: '150', icon: Package, color: 'bg-blue-100 text-blue-600' },
    { title: 'Disponibles', value: '120', icon: Package, color: 'bg-green-100 text-green-600' },
    { title: 'Agotados', value: '20', icon: Package, color: 'bg-red-100 text-red-600' },
    { title: 'Retirados', value: '10', icon: Package, color: 'bg-gray-100 text-gray-600' },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Gestión de Productos</h1>
        <button className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2">
          <Plus size={20} />
          Agregar Producto
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
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Filter size={20} />
            </button>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={20} />
              </button>
              <button
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-lg shadow overflow-hidden ${
                viewMode === 'list' ? 'flex items-center' : ''
              }`}
            >
              <div className={`${viewMode === 'list' ? 'w-32' : 'aspect-square'}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    product.status === 'disponible' 
                      ? 'bg-green-100 text-green-800'
                      : product.status === 'agotado'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {product.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-900">S/ {product.price}</p>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Eye size={18} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Edit size={18} />
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded-lg text-red-600">
                      <Trash2 size={18} />
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

export default Products;