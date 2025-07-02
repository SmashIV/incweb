import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

function CartProductCard({ product, onDelete, onQuantityChange, promoInfo }) {
  const [direction, setDirection] = useState(0); // 1 for up, -1 for down

  const handleChange = (newQty) => {
    setDirection(newQty > product.cantidad ? 1 : -1);
    onQuantityChange(product.id, product.talla, newQty);
  };

  const qtyVariants = {
    enter: (direction) => ({
      y: direction > 0 ? 24 : -24,
      opacity: 0,
      position: 'absolute',
    }),
    center: {
      y: 0,
      opacity: 1,
      position: 'static',
      transition: { type: 'spring', stiffness: 300, damping: 20 }
    },
    exit: (direction) => ({
      y: direction > 0 ? -24 : 24,
      opacity: 0,
      position: 'absolute',
      transition: { type: 'spring', stiffness: 300, damping: 20 }
    })
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="flex items-center bg-white rounded-2xl shadow-[0_4px_24px_0_rgba(0,0,0,0.07)] p-5 mb-6 w-full gap-5 border border-gray-100"
    >
      <img
        src={`/${product.imagen}`}
        alt={product.nombre}
        className="w-20 h-23 object-cover rounded-xl border border-gray-200 shadow-sm"
      />
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <h4 className="text-base font-semibold truncate max-w-[190px] text-gray-900">{product.nombre}</h4>
            <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-0.5 font-medium">{product.categoria?.nombre}</span>
          </div>
          <button
            className="ml-2 text-red-500 text-2xl font-bold rounded-full p-0 hover:text-red-900 transition-none bg-transparent border-none outline-none hover:cursor-pointer"
            onClick={onDelete}
            aria-label="Eliminar producto"
            style={{ background: 'none', boxShadow: 'none' }}
          >
            &times;
          </button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500">Talla: <b className='text-gray-900'>{product.talla}</b></span>
          <span className="text-sm font-semibold text-gray-900">
            {promoInfo && promoInfo.precioConDescuento !== null ? (
              <>
                <span className="line-through text-gray-400 mr-1 text-base">S/. {product.precio_unitario}</span>
                <span className="text-green-600 font-semibold text-base">S/. {promoInfo.precioConDescuento.toFixed(2)}</span>
              </>
            ) : (
              <span className="font-semibold text-gray-600 text-base">S/. {product.precio_unitario}</span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <span className="text-xs text-gray-500">Qty:</span>
          <button
            className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-full bg-white text-xl font-bold text-gray-700 shadow hover:bg-gray-50 active:bg-gray-100 transition"
            onClick={() => handleChange(product.cantidad - 1)}
            disabled={product.cantidad <= 1}
            aria-label="Disminuir cantidad"
            type="button"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            -
          </button>
          <div className="relative w-8 h-8 flex items-center justify-center select-none">
            <AnimatePresence initial={false} custom={direction}>
              <motion.span
                key={product.cantidad}
                custom={direction}
                variants={qtyVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute w-8 text-center text-lg font-semibold text-gray-900"
                style={{ minWidth: 32 }}
              >
                {product.cantidad}
              </motion.span>
            </AnimatePresence>
          </div>
          <button
            className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-full bg-white text-xl font-bold text-gray-700 shadow hover:bg-gray-50 active:bg-gray-100 transition"
            onClick={() => handleChange(product.cantidad + 1)}
            aria-label="Aumentar cantidad"
            type="button"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            +
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function CartSideBar({ open, onClose }) {
  const { items, totalAmount, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const subtotal = items.reduce((sum, item) => {
    const price = item.precio_final ?? item.precio_unitario;
    return sum + price * item.cantidad;
  }, 0);

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          className="fixed top-0 right-0 h-full w-[530px] max-w-full bg-white shadow-2xl z-50 flex flex-col p-6 border-l border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Shopping Cart</h2>
            <motion.button
              className="text-2xl text-gray-500 hover:text-black transition"
              onClick={onClose}
              aria-label="Cerrar carrito"
              whileHover={{ rotate: 360, scale: 1.2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              &times;
            </motion.button>
          </div>
          
          <div className="flex-1 w-full overflow-y-auto">
            <AnimatePresence initial={false}>
              {items.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="flex flex-col items-center justify-center h-full text-gray-500 text-lg font-semibold"
                >
                  Carrito vacio.
                </motion.div>
              ) : (
                items.map((item) => {
                  const originalPrice = item.precio_unitario;
                  const priceWithDiscount = item.precio_final ?? originalPrice;
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 40, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 40, scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className="flex items-center bg-white rounded-2xl shadow-[0_4px_24px_0_rgba(0,0,0,0.07)] p-5 mb-6 w-full gap-5 border border-gray-100"
                      key={`${item.id}-${item.talla}`}
                    >
                      <img
                        src={`/${item.imagen}`}
                        alt={item.nombre}
                        className="w-20 h-23 object-cover rounded-xl border border-gray-200 shadow-sm"
                      />
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <h4 className="text-base font-semibold truncate max-w-[190px] text-gray-900">{item.nombre}</h4>
                            <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-0.5 font-medium">{item.categoria?.nombre}</span>
                          </div>
                          <button
                            className="ml-2 text-red-500 text-2xl font-bold rounded-full p-0 hover:text-red-900 transition-none bg-transparent border-none outline-none hover:cursor-pointer"
                            onClick={() => removeFromCart(item.id, item.talla)}
                            aria-label="Eliminar producto"
                            style={{ background: 'none', boxShadow: 'none' }}
                          >
                            &times;
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">Talla: <b className='text-gray-900'>{item.talla}</b></span>
                          <span className="text-sm font-semibold text-gray-900">
                            {priceWithDiscount !== originalPrice ? (
                              <>
                                <span className="line-through text-gray-400 mr-1 text-base">S/. {originalPrice}</span>
                                <span className="text-green-600 font-semibold text-base">S/. {priceWithDiscount.toFixed(2)}</span>
                              </>
                            ) : (
                              <span className="font-semibold text-gray-600 text-base">S/. {originalPrice}</span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-4">
                          <span className="text-xs text-gray-500">Qty:</span>
                          <button
                            className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-full bg-white text-xl font-bold text-gray-700 shadow hover:bg-gray-50 active:bg-gray-100 transition"
                            onClick={() => updateQuantity(item.id, item.talla, item.cantidad - 1)}
                            disabled={item.cantidad <= 1}
                            aria-label="Disminuir cantidad"
                            type="button"
                            style={{ WebkitTapHighlightColor: 'transparent' }}
                          >
                            -
                          </button>
                          <div className="relative w-8 h-8 flex items-center justify-center select-none">
                            {item.cantidad}
                          </div>
                          <button
                            className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-full bg-white text-xl font-bold text-gray-700 shadow hover:bg-gray-50 active:bg-gray-100 transition"
                            onClick={() => updateQuantity(item.id, item.talla, item.cantidad + 1)}
                            aria-label="Aumentar cantidad"
                            type="button"
                            style={{ WebkitTapHighlightColor: 'transparent' }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>

          {items.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-base font-medium text-gray-900">Subtotal</span>
                <span className="text-lg font-semibold text-gray-900">S/.{subtotal.toFixed(2)}</span>
              </div>
              <button
                className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-900 transition-colors"
                onClick={() => {navigate("/cart")}}
              >
                Detalles de Compra
              </button>
            </div>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
