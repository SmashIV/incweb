import React from 'react';
import { useLocation } from 'react-router-dom';
import { clothesData } from '../constants/testClothes';
import ProductItem from '../components/sales/ProductItem';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResults = () => {
  const query = useQuery();
  const searchTerm = query.get('q') || '';
  const normalized = searchTerm.trim().toLowerCase();

  const filteredProducts = clothesData.filter(product => {
    const title = product.title?.toLowerCase() || '';
    const category = product.category?.toLowerCase() || '';
    const description = product.description?.toLowerCase() || '';
    return (
      title.includes(normalized) ||
      category.includes(normalized) ||
      description.includes(normalized)
    );
  });

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Resultados para: <span className="text-primary">{searchTerm}</span></h2>
      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">No se encontraron productos que coincidan con tu búsqueda.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(item => (
            <ProductItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults; 