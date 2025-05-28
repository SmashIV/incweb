import { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

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
  const {user} = useAuth();

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch({ type: CartActionTypes.CLEAR_CART });
      return;
    }
    try {
      const res = await axios.get('http://localhost:3000/carrito', {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch({ type: CartActionTypes.SET_CART, payload: res.data });
    } catch (e) {
      console.error('Error al obtener el carrito:', e);
      dispatch({ type: CartActionTypes.CLEAR_CART });
    }
  };

  useEffect(() => {
    if (!user) {
      dispatch({type: CartActionTypes.CLEAR_CART});
    }else {
      fetchCart();
    }
    
  }, [user]);

  const addToCart = async (product, quantity = 1, size) => {
    const token = localStorage.getItem('token');
    if (!token) {
      //console warns para debug, despues debo quitar esto.
      console.warn('Usuario no autenticado.');
      return;
    }
    if (!size) {
      console.warn('No se selecciono talla.');
      return;
    }
    try {
      await axios.post(
        'http://localhost:3000/carrito/agregar',
        {
          id_producto: product.id,
          cantidad: quantity,
          talla: size,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchCart();
    } catch (e) {
      if (e.response) {
        console.error('Error al agregar al carrito:', e.response.data);
      } else {
        console.error('Error al agregar al carrito:', e.message);
      }
    }
  };

  const removeFromCart = async (id, size) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await axios.delete(`http://localhost:3000/carrito/eliminar`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { id_producto: id, talla: size },
      });
      await fetchCart();
    } catch (e) {
      if (e.response) {
        console.error('Error al eliminar del carrito:', e.response.data);
      } else {
        console.error('Error al eliminar del carrito:', e.message);
      }
    }
  };

  const updateQuantity = async (id, size, quantity) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await axios.put(
        'http://localhost:3000/carrito/actualizar',
        { id_producto: id, talla: size, cantidad: quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
    } catch (e) {
      if (e.response) {
        console.error('Error al actualizar cantidad:', e.response.data);
      } else {
        console.error('Error al actualizar cantidad:', e.message);
      }
    }
  };

  const clearCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await axios.delete('http://localhost:3000/carrito/limpiar', {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch({ type: CartActionTypes.CLEAR_CART });
    } catch (e) {
      if (e.response) {
        console.error('Error al limpiar el carrito:', e.response.data);
      } else {
        console.error('Error al limpiar el carrito:', e.message);
      }
    }
  };

  const value = {
    items: state.items,
    totalItems: state.totalItems,
    totalAmount: state.totalAmount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    fetchCart,
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