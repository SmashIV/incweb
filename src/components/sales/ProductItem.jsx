import React, { useState } from 'react';
import ProductModal from './ProductModal';
import { EyeClosed, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function ProductItem({ item }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSize, setSelectedSize] = useState(null);
    const [showSizeError, setShowSizeError] = useState(false);
    const navigate = useNavigate();

    return ( 
        <div className="group relative w-full h-full flex flex-col" key={item.id}>
            <div 
                className="w-full aspect-[4/5] bg-gray-200 rounded-md overflow-hidden relative flex-shrink-0 cursor-pointer"
                onClick={() => navigate(`/item-detail/${item.id}`)}
            >
                <img 
                    src={item.imagen} 
                    alt={item.nombre} 
                    className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-75"
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsModalOpen(true);
                        }}
                        className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                    >
                        <EyeClosed className="w-5 h-5 group-hover:hidden"/>
                        <Eye className="w-5 h-5 hidden group-hover:block"/>
                    </button>
                </div>
            </div>
            <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                    <div>
                        <h3 className="text-sm text-gray-700">
                            <span className="relative z-20">{item.categoria?.nombre}</span>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">{item.nombre}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">S/.{item.precio_unitario}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                        <button
                            key={size}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSize(size);
                                setShowSizeError(false);
                            }}
                            className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                                selectedSize === size
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
                {showSizeError && (
                    <p className="text-xs text-red-500 animate-fade-in">
                        Seleccione una talla.
                    </p>
                )}
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 z-[9999]">
                    <ProductModal 
                        item={item} 
                        onClose={() => setIsModalOpen(false)} 
                    />
                </div>
            )}
        </div>    
    );
}

export default ProductItem;