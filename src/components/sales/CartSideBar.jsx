import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

// Placeholder product data
const mockProducts = [
  {
    id: 1,
    title: 'Alpaca Sweater',
    size: 'M',
    category: 'Hombre',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
  },
  {
    id: 2,
    title: 'Scarf Classic',
    size: 'L',
    category: 'Accesorios',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80',
    quantity: 2,
  },
  {
    id: 3,
    title: 'Home Blanket',
    size: 'XL',
    category: 'Hogar',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
  },
];

function CartProductCard({ product, onDelete, onQuantityChange }) {
  const [prevQty, setPrevQty] = useState(product.quantity);
  const [direction, setDirection] = useState(0); // 1 for up, -1 for down

  // Detect direction of change
  const handleChange = (newQty) => {
    setDirection(newQty > product.quantity ? 1 : -1);
    setPrevQty(product.quantity);
    onQuantityChange(product.id, newQty);
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
        src={product.image}
        alt={product.title}
        className="w-20 h-20 object-cover rounded-xl border border-gray-200 shadow-sm"
      />
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <h4 className="text-base font-semibold truncate max-w-[110px] text-gray-900">{product.title}</h4>
            <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-0.5 font-medium">{product.category}</span>
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
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-gray-500">Size: <b className='text-gray-900'>{product.size}</b></span>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <span className="text-xs text-gray-500">Qty:</span>
          <button
            className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-full bg-white text-xl font-bold text-gray-700 shadow hover:bg-gray-50 active:bg-gray-100 transition"
            onClick={() => handleChange(product.quantity - 1)}
            disabled={product.quantity <= 1}
            aria-label="Disminuir cantidad"
            type="button"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            -
          </button>
          <div className="relative w-8 h-8 flex items-center justify-center select-none">
            <AnimatePresence initial={false} custom={direction}>
              <motion.span
                key={product.quantity}
                custom={direction}
                variants={qtyVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute w-8 text-center text-lg font-semibold text-gray-900"
                style={{ minWidth: 32 }}
              >
                {product.quantity}
              </motion.span>
            </AnimatePresence>
          </div>
          <button
            className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-full bg-white text-xl font-bold text-gray-700 shadow hover:bg-gray-50 active:bg-gray-100 transition"
            onClick={() => handleChange(product.quantity + 1)}
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
  const [products, setProducts] = useState(mockProducts);

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleQuantityChange = (id, newQty) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id && newQty > 0 ? { ...p, quantity: newQty } : p
      )
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          className="fixed top-0 right-0 h-full w-[420px] max-w-full bg-white shadow-2xl z-50 flex flex-col p-6 border-l border-gray-200"
        >
          <motion.button
            className="self-end mb-4 text-2xl text-gray-500 hover:text-black transition"
            onClick={onClose}
            aria-label="Cerrar carrito"
            whileHover={{ rotate: 360, scale: 1.2 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            &times;
          </motion.button>
          <div className="flex-1 w-full overflow-y-auto pt-2">
            <AnimatePresence initial={false}>
              {products.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="flex flex-col items-center justify-center h-full text-gray-500 text-lg font-semibold"
                >
                  Your cart is empty
                </motion.div>
              ) : (
                products.map((product) => (
                  <CartProductCard
                    key={product.id}
                    product={product}
                    onDelete={() => handleDelete(product.id)}
                    onQuantityChange={handleQuantityChange}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
