import {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import { useModal } from '../context/ModalContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';

export default function ProductModal({ item, onClose }) {
    const { setModalOpen } = useModal();
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState('M');
    const [showSizeError, setShowSizeError] = useState(false);
    const sizes = ['XS', 'S', 'M', 'L', 'XL'];

    useEffect(() => {
      setModalOpen(true);
      return () => setModalOpen(false);
    }, [setModalOpen]);

    const handleAddToCart = () => {
        if (!selectedSize) {
            setShowSizeError(true);
            setTimeout(() => setShowSizeError(false), 3000);
            return;
        }
        addToCart(item, 1, selectedSize);
        onClose();
    };

    // wavy animation for the product's title :D
    function WaveText({ text }) {
        return (
            <h2 className="text-3xl font-bold flex flex-wrap gap-1">
                {text.split('').map((char, i) => (
                    <motion.span
                        key={i}
                        initial={{ color: '#f2f5f3' }} // gray color
                        animate={{ color: '#000' }} // black color
                        transition={{
                            delay: i * 0.04,
                            duration: 0.1,
                            ease: 'easeInOut',
                        }}
                        className={char === ' ' ? 'w-2' : ''}
                    >
                        {char}
                    </motion.span>
                ))}
            </h2>
        );
    }

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-black/50" 
                onClick={onClose}
            />
            <div className="relative z-[99999] bg-white w-full max-w-6xl rounded-xl shadow-2xl overflow-hidden transform transition-all">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-1"
                    style={{ background: 'none', border: 'none' }}
                    aria-label="Cerrar"
                >
                    <motion.span
                        whileHover={{ scale: 1.2, color: '#111' }}
                        whileTap={{ scale: 0.9, color: '#e11d48' }}
                        className="text-gray-400 text-2xl font-bold transition-colors duration-200 select-none"
                        style={{ display: 'inline-block', lineHeight: 1 }}
                    >
                        ✕
                    </motion.span>
                </button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                    <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-[600px] object-cover rounded-lg"
                    />
                    <div className="space-y-6">
                        <WaveText text={item.title} />
                        <p className="text-gray-600 text-lg">{item.category}</p>
                        <p className="text-4xl font-bold text-emerald-600">S/.{item.price}</p>
                        <div className='space-y-3'>
                            <h3 className='text-xl font-semibold'>Talla</h3>
                            <div className='flex gap-3'>
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => {
                                            setSelectedSize(size);
                                            setShowSizeError(false);
                                        }}
                                        className={`w-12 h-12 rounded-lg border-2 ${selectedSize === size ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'} transition-colors`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                            {showSizeError && (
                                <p className="text-sm text-red-500 animate-fade-in">
                                    Por favor, selecciona una talla
                                </p>
                            )}
                        </div>
                        <div className='space-y-3'>
                            <h3 className='text-xl font-semibold'>Descripcion</h3>
                            <p className='text-gray-600 text-lg'>{item.description}</p>
                        </div>
                        <button 
                            onClick={handleAddToCart}
                            className="w-full bg-black text-white py-4 rounded-lg hover:bg-gray-800 transition-colors text-lg flex items-center justify-center gap-2"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            Añadir al Carrito
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}