import {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import { useModal } from '../context/ModalContext';

export default function ProductModal({ item, onClose }) {
    const { setModalOpen } = useModal();

    useEffect(() => {
      setModalOpen(true);
      return () => setModalOpen(false);
    }, [setModalOpen]);

    const sizes = ['XS', 'S', 'M', 'L', 'XL'];
    const [selectedSize, setSelectedSize] = useState('M');
        // wavy animation for the product's title :D
    function WaveText({ text }) {
        return (
            <h2 className="text-3xl font-bold flex flex-wrap gap-1">
                {text.split('').map((char, i) => (
                    <motion.span
                        key={i}
                        initial={{ color: '#f2f5f3' }} // gray color
                        animate={{ color: '#000' }} // black colo
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
                    className="absolute top-4 right-4 z-50 p-2 bg-white/90 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                >
                    ✕
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
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-12 h-12 rounded-lg border-2 ${selectedSize === size ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'} transition-colors`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className='space-y-3'>
                            <h3 className='text-xl font-semibold'>Descripcion</h3>
                            <p className='text-gray-600 text-lg'>{item.description}</p>
                        </div>
                        <button className="w-full bg-black text-white py-4 rounded-lg hover:bg-gray-800 transition-colors text-lg">
                            Añadir al Carrito
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}