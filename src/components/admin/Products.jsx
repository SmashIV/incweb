import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Filter, Grid, List, Edit, Trash2, Eye, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts, calculateProductStats } from '../../services/productApi';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import axios from 'axios';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, productName }) => {
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
              ¿Eliminar Producto?
            </h3>
            
            <p className="text-gray-600 text-center mb-6">
              ¿Estás seguro de que deseas eliminar <span className="font-medium">{productName}</span>? 
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

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    disponibles: 0,
    agotados: 0,
    retirados: 0
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productsData = await getProducts();
        
        // Obtener las imágenes adicionales para cada producto
        const productsWithImages = await Promise.all(
          productsData.map(async (product) => {
            try {
              const response = await axios.get(
                `http://localhost:3000/admin/get_producto_imagenes/${product.id}`,
                {
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                  }
                }
              );
              return {
                ...product,
                imagenes_adicionales: response.data
              };
            } catch (error) {
              console.error(`Error al cargar imágenes para el producto ${product.id}:`, error);
              return {
                ...product,
                imagenes_adicionales: []
              };
            }
          })
        );

        console.log('Productos con imágenes:', productsWithImages);
        setProducts(productsWithImages);
        setStats(calculateProductStats(productsWithImages));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddProduct = async (formData) => {
    try {
      console.log('Datos del producto a enviar:', formData);
      const productsData = await getProducts();
      setProducts(productsData);
      setStats(calculateProductStats(productsData));
    } catch (error) {
      console.error('Error al agregar producto:', error);
      throw error;
    }
  };

  const handleEditProduct = async (formData) => {
    try {
      const productsData = await getProducts();
      setProducts(productsData);
      setStats(calculateProductStats(productsData));
    } catch (error) {
      console.error('Error al editar producto:', error);
      throw error;
    }
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeletingProductId(productToDelete.id);
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:3000/admin/delete_producto/${productToDelete.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setTimeout(async () => {
        const productsData = await getProducts();
        setProducts(productsData);
        setStats(calculateProductStats(productsData));
        setDeletingProductId(null);
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
      }, 500);
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      alert('Error al eliminar el producto. Por favor, intente nuevamente.');
      setDeletingProductId(null);
    }
  };

  const handleViewModeChange = (mode) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setViewMode(mode);
      setIsTransitioning(false);
    }, 400);
  };

  const filteredProducts = products.filter(product =>
    product.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.categoria.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statsCards = [
    { title: 'Total Productos', value: stats.total, icon: Package, color: 'bg-blue-100 text-blue-600' },
    { title: 'Disponibles', value: stats.disponibles, icon: Package, color: 'bg-green-100 text-green-600' },
    { title: 'Agotados', value: stats.agotados, icon: Package, color: 'bg-red-100 text-red-600' },
    { title: 'Retirados', value: stats.retirados, icon: Package, color: 'bg-gray-100 text-gray-600' },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Gestión de Productos</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Agregar Producto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsCards.map((stat, index) => (
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
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid' ? 'bg-white shadow-lg scale-110' : ''
                }`}
                onClick={() => handleViewModeChange('grid')}
              >
                <Grid size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'list' ? 'bg-white shadow-lg scale-110' : ''
                }`}
                onClick={() => handleViewModeChange('list')}
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
      ) : (
        <motion.div
          layout
          className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={
                isTransitioning ? {
                  x: [0, -20, 20, -10, 10, 0],
                  y: [0, -10, 10, -5, 5, 0],
                  rotate: [0, -5, 5, -2, 2, 0],
                  scale: [1, 0.95, 1.05, 0.98, 1.02, 1],
                  transition: { 
                    duration: 0.4,
                    times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                    ease: "easeInOut"
                  }
                } : deletingProductId === product.id ? {
                  opacity: 0,
                  scale: 0.8,
                  x: [0, 20, -20, 20, -20, 0],
                  rotate: [0, 5, -5, 5, -5, 0],
                  filter: ["blur(0px)", "blur(2px)", "blur(4px)"],
                  transition: { duration: 0.5 }
                } : {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: { 
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                    delay: index * 0.02
                  }
                }
              }
              exit={{ 
                x: [0, -20, 20, -10, 10, 0],
                y: [0, -10, 10, -5, 5, 0],
                rotate: [0, -5, 5, -2, 2, 0],
                scale: [1, 0.95, 1.05, 0.98, 1.02, 1],
                transition: { 
                  duration: 0.4,
                  times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                  ease: "easeInOut"
                }
              }}
              className={`bg-white rounded-lg shadow overflow-hidden ${
                viewMode === 'list' ? 'flex items-center' : ''
              }`}
              style={{
                transformOrigin: "center center",
                perspective: "1000px",
                transformStyle: "preserve-3d"
              }}
            >
              <div className={`${viewMode === 'list' ? 'w-32' : 'aspect-square'} relative overflow-hidden`}>
                <img
                  src={`/${product.imagen}`}
                  alt={product.nombre}
                  className="w-full h-full object-contain bg-gray-50"
                  onError={(e) => {
                    console.error('Error loading image:', product.imagen);
                    e.target.src = '/placeholder.png';
                  }}
                />
                {product.imagenes_adicionales && product.imagenes_adicionales.length > 0 && (
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    +{product.imagenes_adicionales.length}
                  </div>
                )}
              </div>
              <div className="p-4 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{product.nombre}</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    product.estado === 'disponible' 
                      ? 'bg-green-100 text-green-800'
                      : product.estado === 'agotado'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {product.estado}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{product.categoria.nombre}</p>
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-900">S/ {product.precio_unitario}</p>
                  <div className="flex items-center gap-2">
                    <button 
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      onClick={() => handleEditClick(product)}
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                      onClick={() => handleDeleteClick(product)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddProduct}
      />

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleEditProduct}
        product={selectedProduct}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        productName={productToDelete?.nombre}
      />
    </div>
  );
};

export default Products;