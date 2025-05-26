import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

function CartProductCard({ product, onDelete, onQuantityChange }) {
  const [direction, setDirection] = useState(0); // 1 for up, -1 for down

  // Detect direction of change
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
        className="w-20 h-20 object-cover rounded-xl border border-gray-200 shadow-sm"
      />
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <h4 className="text-base font-semibold truncate max-w-[190px] text-gray-900">{product.nombre}</h4>
            <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-0.5 font-medium">{product.categoria?.nombre}</span>
          </div>
          <button
            className="ml-2 text-red-500 text-2xl font-bold rounded-full p-0 hover:text-red-700 transition-none bg-transparent border-none outline-none"
            onClick={onDelete}
            aria-label="Eliminar producto"
            style={{ background: 'none', boxShadow: 'none' }}
          >
            &times;
          </button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500">Talla: <b className='text-gray-900'>{product.talla}</b></span>
          <span className="text-sm font-semibold text-gray-900">S/.{product.precio_unitario}</span>
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

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          className="fixed top-0 right-0 h-full w-[500px] max-w-full bg-white shadow-2xl z-50 flex flex-col p-6 border-l border-gray-200"
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
                items.map((item) => (
                  <CartProductCard
                    key={`${item.id}-${item.talla}`}
                    product={item}
                    onDelete={() => removeFromCart(item.id, item.talla)}
                    onQuantityChange={updateQuantity}
                  />
                ))
              )}
            </AnimatePresence>
          </div>

          {items.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-base font-medium text-gray-900">Subtotal</span>
                <span className="text-lg font-semibold text-gray-900">S/.{totalAmount.toFixed(2)}</span>
              </div>
              <button
                className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-900 transition-colors"
                onClick={() => {navigate("/prueba")}}
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
