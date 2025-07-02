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

const fetchPromoForItem = async (item) => {
  const token = localStorage.getItem('token');
  let precioTalla = null;
  let precioColor = null;
  let dataTalla = null;
  let dataColor = null;
  let promo_aplicada = null;

  // Consulta promo por talla si el producto tiene talla
  if (item.talla) {
    try {
      const resTalla = await axios.get(`http://localhost:3000/promociones/por-talla?talla=${item.talla}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      dataTalla = resTalla.data;
      if (dataTalla && dataTalla.hasPromo && dataTalla.talla_objetivo === item.talla) {
        precioTalla = item.precio_unitario;
        if (dataTalla.descuento_porcentaje) {
          precioTalla = precioTalla * (1 - dataTalla.descuento_porcentaje / 100);
        } else if (dataTalla.descuento_fijo) {
          precioTalla = precioTalla - dataTalla.descuento_fijo;
        }
      }
    } catch {}
  }

  // Consulta promo por color SIEMPRE si hay color
  if (item.color) {
    try {
      const resColor = await axios.get(`http://localhost:3000/promociones/por-color?tcolor=${encodeURIComponent(item.color)}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      dataColor = resColor.data;
      if (dataColor && dataColor.hasPromo && dataColor.color_objetivo === item.color) {
        precioColor = item.precio_unitario;
        if (dataColor.descuento_porcentaje) {
          precioColor = precioColor * (1 - dataColor.descuento_porcentaje / 100);
        } else if (dataColor.descuento_fijo) {
          precioColor = precioColor - dataColor.descuento_fijo;
        }
        // Usar el campo 'titulo' directamente del backend
        var tituloPromoColor = dataColor.titulo || null;
      }
    } catch {}
  }

  let precio_final = null;
  // Determinar cuál promoción aplicar (la de mayor descuento)
  if (precioTalla !== null && precioColor !== null) {
    if (precioTalla < precioColor) {
      precio_final = precioTalla;
      if (dataTalla && dataTalla.hasPromo) {
        promo_aplicada = {
          tipo: 'talla',
          valor: item.talla,
          descuento_porcentaje: dataTalla.descuento_porcentaje || null,
          descuento_fijo: dataTalla.descuento_fijo || null,
          id_promocion: dataTalla.id_promocion || null,
          titulo: dataTalla.titulo || null
        };
      }
    } else {
      precio_final = precioColor;
      if (dataColor && dataColor.hasPromo) {
        promo_aplicada = {
          tipo: 'color',
          valor: item.color,
          descuento_porcentaje: dataColor.descuento_porcentaje || null,
          descuento_fijo: dataColor.descuento_fijo || null,
          id_promocion: dataColor.id_promocion || null,
          titulo: tituloPromoColor
        };
      }
    }
  } else if (precioTalla !== null) {
    precio_final = precioTalla;
    if (dataTalla && dataTalla.hasPromo) {
      promo_aplicada = {
        tipo: 'talla',
        valor: item.talla,
        descuento_porcentaje: dataTalla.descuento_porcentaje || null,
        descuento_fijo: dataTalla.descuento_fijo || null,
        id_promocion: dataTalla.id_promocion || null,
        titulo: dataTalla.titulo || null
      };
    }
  } else if (precioColor !== null) {
    precio_final = precioColor;
    if (dataColor && dataColor.hasPromo) {
      promo_aplicada = {
        tipo: 'color',
        valor: item.color,
        descuento_porcentaje: dataColor.descuento_porcentaje || null,
        descuento_fijo: dataColor.descuento_fijo || null,
        id_promocion: dataColor.id_promocion || null,
        titulo: tituloPromoColor
      };
    }
  }
  if (precio_final !== null) {
    precio_final = Math.round(precio_final * 100) / 100;
    // Solo poner precio_final si es realmente un descuento
    if (precio_final < item.precio_unitario) {
      return { ...item, precio_final, promo_aplicada };
    }
  }
  // Si no hay descuento, no poner precio_final ni promo_aplicada
  return { ...item, precio_final: undefined, promo_aplicada: null };
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case CartActionTypes.SET_CART: {
      const items = action.payload;
      const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);
      const totalAmount = items.reduce((sum, item) => {
        const itemTotal = Number(item.precio_final ?? item.precio_unitario) * Number(item.cantidad);
        return Math.round((sum + itemTotal) * 100) / 100;
      }, 0);
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
      const itemsWithPromo = await Promise.all(res.data.map(fetchPromoForItem));
      dispatch({ type: CartActionTypes.SET_CART, payload: itemsWithPromo });
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