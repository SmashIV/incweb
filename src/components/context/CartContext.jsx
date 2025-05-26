import { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

const initialState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
};

const CartActionTypes = {
  SET_CART: 'SET_CART',
  CLEAR_CART: 'CLEAR_CART',
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case CartActionTypes.SET_CART: {
      const items = action.payload;
      const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);
      const totalAmount = items.reduce((sum, item) => sum + (item.precio_unitario * item.cantidad), 0);
      return { items, totalItems, totalAmount };
    }
    case CartActionTypes.CLEAR_CART:
      return initialState;
    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Cargar el carrito del backend al iniciar sesión o recargar
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await axios.get('http://localhost:3000/carrito', {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch({ type: CartActionTypes.SET_CART, payload: res.data });
      } catch (e) {
        dispatch({ type: CartActionTypes.CLEAR_CART });
      }
    };
    fetchCart();
  }, []);

  const addToCart = async (product, quantity = 1, size) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para agregar productos al carrito.');
      return;
    }
    await axios.post(
      'http://localhost:3000/carrito/agregar',
      {
        id_producto: product.id,
        cantidad: quantity,
        genero: product.genero || 'unisex',
        talla: size,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    // Refresca el carrito
    const res = await axios.get('http://localhost:3000/carrito', {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: CartActionTypes.SET_CART, payload: res.data });
  };

  const removeFromCart = async (id, size) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    await axios.delete(`http://localhost:3000/carrito/eliminar`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { id_producto: id, talla: size },
    });
    const res = await axios.get('http://localhost:3000/carrito', {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: CartActionTypes.SET_CART, payload: res.data });
  };

  const updateQuantity = async (id, size, quantity) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    await axios.put(
      'http://localhost:3000/carrito/actualizar',
      { id_producto: id, talla: size, cantidad: quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const res = await axios.get('http://localhost:3000/carrito', {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: CartActionTypes.SET_CART, payload: res.data });
  };

  const clearCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    await axios.delete('http://localhost:3000/carrito/limpiar', {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: CartActionTypes.CLEAR_CART });
  };

  const value = {
    items: state.items,
    totalItems: state.totalItems,
    totalAmount: state.totalAmount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 