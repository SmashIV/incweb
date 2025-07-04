import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ShoppingCart } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [showModal, setShowModal] = useState(false);
  const [showSizes, setShowSizes] = useState(true);
  const [showSizeError, setShowSizeError] = useState(false);
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  const { addNotification } = useNotification();
  const { user } = useAuth();

  const [promoInfo, setPromoInfo] = useState(null);
  const [precioConDescuento, setPrecioConDescuento] = useState(null);

  const needsSizeSelection = (product) => {
    if (!product) return true;
    return product.genero !== 'accesorios' && product.genero !== 'hogar';
  };

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }, 0);
  }, [id]);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:3000/productos/${id}`)
      .then(res => {
        setProduct(res.data);
        if (res.data) {
          if (!needsSizeSelection(res.data)) {
            setSelectedSize('M');
            setShowSizes(false);
          }
          
          const token = localStorage.getItem('token');
          axios.get(`http://localhost:3000/admin/get_producto_imagenes/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
            .then(imgsRes => {
              const allImages = [res.data.imagen, ...imgsRes.data.map(img => img.url_imagen)];
              setImages(allImages);
              setSelectedImage(allImages[0]);
            })
            .catch(err => {
              console.error('Error al cargar imágenes adicionales:', err);
              setImages([res.data.imagen]);
              setSelectedImage(res.data.imagen);
            });
        } else {
          setImages([]);
          setSelectedImage(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setImages([]);
        setSelectedImage(null);
      });
  }, [id]);

  useEffect(() => {
    if (!product) {
      setPromoInfo(null);
      setPrecioConDescuento(null);
      return;
    }
    const token = localStorage.getItem('token');
    if (!needsSizeSelection(product)) {
      if (product.color) {
        axios.get(`http://localhost:3000/promociones/por-color?tcolor=${encodeURIComponent(product.color)}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        })
        .then(resColor => {
          const dataColor = resColor.data;
          let precioColor = null;
          if (dataColor && dataColor.hasPromo && dataColor.color_objetivo === product.color) {
            precioColor = product.precio_unitario;
            if (dataColor.descuento_porcentaje) {
              precioColor = precioColor * (1 - dataColor.descuento_porcentaje / 100);
            } else if (dataColor.descuento_fijo) {
              precioColor = precioColor - dataColor.descuento_fijo;
            }
            precioColor = Math.round(precioColor * 100) / 100;
            setPromoInfo([{ tipo: 'color', data: dataColor }]);
            setPrecioConDescuento(precioColor !== product.precio_unitario ? precioColor : null);
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
    const tallaPromise = axios.get(`http://localhost:3000/promociones/por-talla?talla=${selectedSize}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    const colorPromise = product.color ? axios.get(`http://localhost:3000/promociones/por-color?tcolor=${encodeURIComponent(product.color)}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    }) : Promise.resolve({ data: { hasPromo: false } });
    Promise.all([tallaPromise, colorPromise])
      .then(([resTalla, resColor]) => {
        const dataTalla = resTalla.data;
        const dataColor = resColor.data;
        let precioTalla = null;
        let precioColor = null;
        if (dataTalla && dataTalla.hasPromo && dataTalla.talla_objetivo === selectedSize) {
          precioTalla = product.precio_unitario;
          if (dataTalla.descuento_porcentaje) {
            precioTalla = precioTalla * (1 - dataTalla.descuento_porcentaje / 100);
          } else if (dataTalla.descuento_fijo) {
            precioTalla = precioTalla - dataTalla.descuento_fijo;
          }
        }
        if (dataColor && dataColor.hasPromo && dataColor.color_objetivo === product.color) {
          precioColor = product.precio_unitario;
          if (dataColor.descuento_porcentaje) {
            precioColor = precioColor * (1 - dataColor.descuento_porcentaje / 100);
          } else if (dataColor.descuento_fijo) {
            precioColor = precioColor - dataColor.descuento_fijo;
          }
        }
        let precioFinal = product.precio_unitario;
        let badges = [];
        
        // Aplicar ambas promociones de forma acumulativa
        if (precioTalla !== null) {
          precioFinal = precioTalla;
          badges.push({ tipo: 'talla', data: dataTalla });
        }
        
        if (precioColor !== null) {
          // Aplicar la promoción de color sobre el precio ya descontado por talla
          let precioConColor = precioFinal;
          if (dataColor.descuento_porcentaje) {
            precioConColor = precioConColor * (1 - dataColor.descuento_porcentaje / 100);
          } else if (dataColor.descuento_fijo) {
            precioConColor = precioConColor - dataColor.descuento_fijo;
          }
          precioFinal = Math.max(precioConColor, 0); // Evitar precios negativos
          badges.push({ tipo: 'color', data: dataColor });
        }
        precioFinal = Math.round(precioFinal * 100) / 100;
        setPromoInfo(badges);
        setPrecioConDescuento(precioFinal !== product.precio_unitario ? precioFinal : null);
      })
      .catch(() => {
        setPromoInfo(null);
        setPrecioConDescuento(null);
      });
  }, [product, selectedSize]);

  if (loading || !product) {
    return <div className="text-center py-20">Cargando producto...</div>;
  }

  const sizeTable = [
    { size: 'XS', pecho: 84, cintura: 66, cadera: 90 },
    { size: 'S', pecho: 88, cintura: 70, cadera: 94 },
    { size: 'M', pecho: 92, cintura: 74, cadera: 98 },
    { size: 'L', pecho: 96, cintura: 78, cadera: 102 },
    { size: 'XL', pecho: 100, cintura: 82, cadera: 106 },
  ];

  const handleAddToCart = () => {
    if (!user) {
      addNotification('Debes iniciar sesión para agregar productos al carrito.', 'error');
      return;
    }
    if (needsSizeSelection(product) && !selectedSize) {
      setShowSizeError(true);
      setTimeout(() => setShowSizeError(false), 3000);
      return;
    }
    addToCart(product, 1, selectedSize);
    addNotification("¡Producto agregado al carrito!", "success");
    setShowAddedToCart(true);
    setTimeout(() => setShowAddedToCart(false), 2000);
  };

  const shouldShowSizes = needsSizeSelection(product) && showSizes;

  return (
    <div className="w-full bg-gray-50 flex items-start justify-center mb-10 pt-10">
      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 pt-20 pb-[50px] px-4">
        <div className="flex flex-row lg:flex-col gap-4 items-center justify-center lg:justify-start">
          {images.map((img, idx) => (
            <button
              key={img + idx}
              onClick={() => setSelectedImage(img)}
              className={`border-1 rounded-lg overflow-hidden w-16 h-20 flex items-center justify-center transition-all duration-200 hover:cursor-pointer ${selectedImage === img ? 'border-gray-400' : 'border-gray-200'}`}
              aria-label={`Vista previa ${idx + 1}`}
            >
              <img src={`/${img}`} alt={`Vista previa ${idx + 1}`} className="object-cover w-full h-full" />
            </button>
          ))}
        </div>

        <div className="flex-1 flex items-center justify-center lg:items-start lg:justify-center">
          <div className="w-full max-w-md aspect-[4/5] bg-gray-100 overflow-hidden flex items-center justify-center shadow-md">
            <img src={`/${selectedImage}`} alt={product.nombre} className="object-cover w-full h-full" />
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-8 justify-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.nombre}</h1>
            <p className="text-2xl font-bold text-black mb-6">
              {precioConDescuento !== null && precioConDescuento < product.precio_unitario ? (
                <>
                  <span className="line-through text-gray-400 mr-2 text-lg">S/. {product.precio_unitario}</span>
                  <span className="text-green-600 font-semibold text-xl">S/. {precioConDescuento.toFixed(2)}</span>
                  {promoInfo && promoInfo.map((badge, idx) => (
                    <span key={idx} className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${badge.tipo === 'talla' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {badge.tipo === 'talla' ? (badge.data.titulo || `Promo talla ${badge.data.talla_objetivo}`) : (badge.data.titulo || `Promo color ${badge.data.color_objetivo}`)}
                    </span>
                  ))}
                </>
              ) : (
                <span className="font-semibold text-gray-600 text-xl">S/. {product.precio_unitario}</span>
              )}
            </p>
            <hr className="my-8 border-gray-300" />
            <div>
              <p className="text-lg text-gray-700 mb-4">{product.descripcion}</p>
            </div>
            <AnimatePresence>
              {!shouldShowSizes && (
                <motion.div
                  key="composicion-cuidado"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                >
                  <hr className="my-6 border-gray-300" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Composición</h3>
                    <p className="text-gray-700 mb-2">100% BABY ALPACA</p>
                  </div>
                  <hr className="my-6 border-gray-300" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Cuidado</h3>
                    <p className="text-gray-700 whitespace-pre-line mb-2">
                      Limpieza al seco, usando cualquier solvente excepto tricloroetileno.

Planchar a baja temperatura (110°C)

No almacenar en bolsa de plástico, puede crear humedad.

Como regla general, recomendamos no colgar este tipo de prenda.
                    </p>
                  </div>
                  <hr className="my-6 border-gray-300" />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex flex-col gap-6 mt-6">
              {needsSizeSelection(product) && !showSizes && (
                <motion.button
                  layout
                  className="px-6 py-3 bg-gray-100 text-black rounded-full font-semibold text-base shadow hover:bg-gray-200 transition w-fit mx-auto"
                  onClick={() => setShowSizes(true)}
                  whileTap={{ scale: 0.97 }}
                >
                  Ver tallas
                </motion.button>
              )}
              <AnimatePresence>
                {shouldShowSizes && (
                  <motion.div
                    layout
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-3 flex-wrap mb-2 mt-2">
                      {sizes.map((size, idx) => (
                        <React.Fragment key={size}>
                          <button
                            onClick={() => {
                              setSelectedSize(size);
                              setShowSizeError(false);
                            }}
                            className={`w-12 h-12 rounded-lg text-lg font-bold transition-colors duration-200
                              ${selectedSize === size ? 'bg-black text-white' : 'bg-gray-100 text-black hover:bg-gray-200'}`}
                          >
                            {size}
                          </button>
                          {idx === sizes.length - 1 && (
                            <motion.button
                              className="ml-4 px-2 py-2 bg-transparent text-black rounded-full border-none hover:bg-gray-200 transition flex items-center"
                              onClick={() => setShowSizes(false)}
                              whileTap={{ scale: 0.95 }}
                              aria-label="Contraer tallas"
                            >
                              <ChevronLeft className="w-6 h-6" />
                            </motion.button>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="text-black text-sm underline hover:text-emerald-700 transition bg-transparent border-none p-0 mt-1"
                      onClick={() => setShowModal(true)}
                    >
                      Tabla de medidas
                    </button>
                    {showSizeError && (
                      <p className="text-sm text-red-500 mt-2 animate-fade-in">
                        Por favor, selecciona una talla
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="relative">
                <button 
                  onClick={handleAddToCart}
                  className="w-full px-8 py-4 bg-black text-white rounded-full font-semibold text-lg shadow-lg hover:bg-gray-900 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Añadir al carrito
                </button>
                <AnimatePresence>
                  {showAddedToCart && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 text-center text-green-600 font-medium"
                    >
                      ¡Producto añadido al carrito!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            {showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative animate-fade-in">
                  <button
                    className="absolute top-3 right-3 p-1"
                    style={{ background: 'none', border: 'none' }}
                    onClick={() => setShowModal(false)}
                    aria-label="Cerrar"
                  >
                    <motion.span
                      whileHover={{ scale: 1.2, color: '#111' }}
                      whileTap={{ scale: 0.9, color: '#e11d48' }}
                      className="text-gray-400 text-2xl font-bold transition-colors duration-200 select-none"
                      style={{ display: 'inline-block', lineHeight: 1 }}
                    >
                      ×
                    </motion.span>
                  </button>
                  <h2 className="text-xl font-bold mb-4 text-center">Tabla de medidas (cm)</h2>
                  <table className="w-full text-sm text-center border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 font-semibold">Talla</th>
                        <th className="py-2 font-semibold">Pecho</th>
                        <th className="py-2 font-semibold">Cintura</th>
                        <th className="py-2 font-semibold">Cadera</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sizeTable.map((row) => (
                        <tr key={row.size} className="border-b last:border-0">
                          <td className="py-2 font-bold">{row.size}</td>
                          <td className="py-2">{row.pecho}cm</td>
                          <td className="py-2">{row.cintura}cm</td>
                          <td className="py-2">{row.cadera}cm</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail; 