import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductItem from '../components/sales/ProductItem';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResults = () => {
  const query = useQuery();
  const searchTerm = query.get('q') || '';
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!searchTerm.trim()) {
      setProducts([]);
      return;
    }
    setLoading(true);
    setError(null);
    axios.get(`http://localhost:3000/productos/search?q=${encodeURIComponent(searchTerm)}`)
      .then(res => {
        setProducts(res.data || []);
      })
      .catch(() => {
        setError('Error al buscar productos.');
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [searchTerm]);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Resultados para: <span className="text-primary">{searchTerm}</span></h2>
      {loading ? (
        <p className="text-gray-500">Buscando productos...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No se encontraron productos que coincidan con tu búsqueda.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(item => (
            <ProductItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults; 