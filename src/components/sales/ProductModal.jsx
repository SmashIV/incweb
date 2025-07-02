import {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import { useModal } from '../context/ModalContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';
import axios from 'axios';

export default function ProductModal({ item, onClose }) {
    const { setModalOpen } = useModal();
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState('M');
    const [showSizeError, setShowSizeError] = useState(false);
    const [loading, setLoading] = useState(false);
    const sizes = ['XS', 'S', 'M', 'L', 'XL'];
    const [success, setSuccess] = useState(false);
    const [authError, setAuthError] = useState(false);
    const [promoInfo, setPromoInfo] = useState(null);
    const [precioConDescuento, setPrecioConDescuento] = useState(null);

    useEffect(() => {
      setModalOpen(true);
      return () => setModalOpen(false);
    }, [setModalOpen]);

    useEffect(() => {
      if (!item) {
        setPromoInfo(null);
        setPrecioConDescuento(null);
        return;
      }
      if (item.genero === 'accesorios' || item.genero === 'hogar') {
        // Solo promo por color
        if (item.color) {
          const token = localStorage.getItem('token');
          axios.get(`http://localhost:3000/promociones/por-color?tcolor=${encodeURIComponent(item.color)}`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
          })
          .then(resColor => {
            const dataColor = resColor.data;
            let precioColor = null;
            if (dataColor && dataColor.hasPromo && dataColor.color_objetivo === item.color) {
              precioColor = item.precio_unitario;
              if (dataColor.descuento_porcentaje) {
                precioColor = precioColor * (1 - dataColor.descuento_porcentaje / 100);
              } else if (dataColor.descuento_fijo) {
                precioColor = precioColor - dataColor.descuento_fijo;
              }
              precioColor = Math.round(precioColor * 100) / 100;
              setPromoInfo([{ tipo: 'color', data: dataColor }]);
              setPrecioConDescuento(precioColor !== item.precio_unitario ? precioColor : null);
            } else {
              setPromoInfo(null);
              setPrecioConDescuento(null);
            }
          })
          .catch(() => {
            setPromoInfo(null);
            setPrecioConDescuento(null);
          });
        } else {
          setPromoInfo(null);
          setPrecioConDescuento(null);
        }
        return;
      }
      if (!selectedSize) {
        setPromoInfo(null);
        setPrecioConDescuento(null);
        return;
      }
      const token = localStorage.getItem('token');
      // Consultar promo por talla
      const tallaPromise = axios.get(`http://localhost:3000/promociones/por-talla?talla=${selectedSize}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      // Consultar promo por color
      const colorPromise = item.color ? axios.get(`http://localhost:3000/promociones/por-color?tcolor=${encodeURIComponent(item.color)}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      }) : Promise.resolve({ data: { hasPromo: false } });
      Promise.all([tallaPromise, colorPromise])
        .then(([resTalla, resColor]) => {
          const dataTalla = resTalla.data;
          const dataColor = resColor.data;
          let precioTalla = null;
          let precioColor = null;
          if (dataTalla && dataTalla.hasPromo && dataTalla.talla_objetivo === selectedSize) {
            precioTalla = item.precio_unitario;
            if (dataTalla.descuento_porcentaje) {
              precioTalla = precioTalla * (1 - dataTalla.descuento_porcentaje / 100);
            } else if (dataTalla.descuento_fijo) {
              precioTalla = precioTalla - dataTalla.descuento_fijo;
            }
          }
          if (dataColor && dataColor.hasPromo && dataColor.color_objetivo === item.color) {
            precioColor = item.precio_unitario;
            if (dataColor.descuento_porcentaje) {
              precioColor = precioColor * (1 - dataColor.descuento_porcentaje / 100);
            } else if (dataColor.descuento_fijo) {
              precioColor = precioColor - dataColor.descuento_fijo;
            }
          }
          let precioFinal = item.precio_unitario;
          let badges = [];
          if (precioTalla !== null && precioColor !== null) {
            if (precioTalla < precioColor) {
              precioFinal = precioTalla;
              badges.push({ tipo: 'talla', data: dataTalla });
            } else if (precioColor < precioTalla) {
              precioFinal = precioColor;
              badges.push({ tipo: 'color', data: dataColor });
            } else {
              precioFinal = precioTalla; // ambos iguales
              badges.push({ tipo: 'talla', data: dataTalla });
              badges.push({ tipo: 'color', data: dataColor });
            }
          } else if (precioTalla !== null) {
            precioFinal = precioTalla;
            badges.push({ tipo: 'talla', data: dataTalla });
          } else if (precioColor !== null) {
            precioFinal = precioColor;
            badges.push({ tipo: 'color', data: dataColor });
          }
          precioFinal = Math.round(precioFinal * 100) / 100;
          setPromoInfo(badges);
          setPrecioConDescuento(precioFinal !== item.precio_unitario ? precioFinal : null);
        })
        .catch(() => {
          setPromoInfo(null);
          setPrecioConDescuento(null);
        });
    }, [item, selectedSize]);

    const handleAddToCart = async () => {
        if (!selectedSize) {
            setShowSizeError(true);
            setTimeout(() => setShowSizeError(false), 3000);
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) {
            setAuthError(true);
            setTimeout(() => setAuthError(false), 3000);
            return;
        }
        setLoading(true);
        try {
            await addToCart(item, 1, selectedSize);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 1200);
        } catch (e) {
            console.log('Error al agregar al carrito. Revisar backend.'); //for debug only
        } finally {
            setLoading(false);
        }
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
                        src={item.imagen} 
                        alt={item.nombre}
                        className="w-full h-[600px] object-cover rounded-lg"
                    />
                    <div className="space-y-6">
                        <WaveText text={item.nombre} />
                        <p className="text-gray-600 text-lg">{item.categoria?.nombre}</p>
                        <p className="text-4xl font-bold text-emerald-600">
                            {precioConDescuento !== null && precioConDescuento < item.precio_unitario ? (
                                <>
                                    <span className="line-through text-gray-400 mr-2 text-lg">S/.{item.precio_unitario}</span>
                                    <span className="text-green-600 font-semibold text-2xl">S/.{precioConDescuento.toFixed(2)}</span>
                                    {promoInfo && promoInfo.map((badge, idx) => (
                                        <span key={idx} className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${badge.tipo === 'talla' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {badge.tipo === 'talla' ? (badge.data.titulo || `Promo talla ${badge.data.talla_objetivo}`) : (badge.data.titulo || `Promo color ${badge.data.color_objetivo}`)}
                                        </span>
                                    ))}
                                </>
                            ) : (
                                <span className="font-semibold text-gray-600 text-2xl">S/.{item.precio_unitario}</span>
                            )}
                        </p>
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
                                        disabled={loading}
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
                            <p className='text-gray-600 text-lg'>{item.descripcion}</p>
                        </div>
                        <button 
                            onClick={handleAddToCart}
                            className="w-full bg-black text-white py-4 rounded-lg hover:bg-gray-800 transition-colors text-lg flex items-center justify-center gap-2 disabled:opacity-60"
                            disabled={loading}
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {loading ? 'Agregando...' : 'Añadir al Carrito'}
                        </button>
                        {success && (
                            <div className="text-green-600 text-center font-semibold mt-2">¡Producto agregado al carrito!</div>
                        )}
                        {authError && (
                            <div className="text-red-600 text-center font-semibold mt-2">
                                Debes iniciar sesión para agregar productos al carrito.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}