import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const initialState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
};

// Cart actions
const CartActionTypes = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case CartActionTypes.ADD_TO_CART: {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id && item.size === action.payload.size
      );

      if (existingItemIndex > -1) {
        // Item exists, update quantity
        const updatedItems = state.items.map((item, index) => {
          if (index === existingItemIndex) {
            return {
              ...item,
              quantity: item.quantity + action.payload.quantity,
            };
          }
          return item;
        });

        return {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + action.payload.quantity,
          totalAmount: state.totalAmount + (action.payload.price * action.payload.quantity),
        };
      }

      // New item
      return {
        ...state,
        items: [...state.items, action.payload],
        totalItems: state.totalItems + action.payload.quantity,
        totalAmount: state.totalAmount + (action.payload.price * action.payload.quantity),
      };
    }

    case CartActionTypes.REMOVE_FROM_CART: {
      const itemToRemove = state.items.find(item => 
        item.id === action.payload.id && item.size === action.payload.size
      );
      
      return {
        ...state,
        items: state.items.filter(item => 
          !(item.id === action.payload.id && item.size === action.payload.size)
        ),
        totalItems: state.totalItems - itemToRemove.quantity,
        totalAmount: state.totalAmount - (itemToRemove.price * itemToRemove.quantity),
      };
    }

    case CartActionTypes.UPDATE_QUANTITY: {
      const { id, size, quantity } = action.payload;
      
      const updatedItems = state.items.map(item => {
        if (item.id === id && item.size === size) {
          //const quantityDiff = quantity - item.quantity;
          return { ...item, quantity };
        }
        return item;
      });

      const updatedState = {
        ...state,
        items: updatedItems,
      };

      // Recalculate totals
      updatedState.totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      updatedState.totalAmount = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return updatedState;
    }

    case CartActionTypes.CLEAR_CART:
      return initialState;

    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Persist cart to localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      Object.keys(CartActionTypes).forEach(actionType => {
        if (parsedCart[actionType]) {
          dispatch({ type: CartActionTypes[actionType], payload: parsedCart[actionType] });
        }
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const addToCart = (product, quantity = 1, size) => {
    dispatch({
      type: CartActionTypes.ADD_TO_CART,
      payload: {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity,
        size,
        category: product.category,
      },
    });
  };

  const removeFromCart = (id, size) => {
    dispatch({
      type: CartActionTypes.REMOVE_FROM_CART,
      payload: { id, size },
    });
  };

  const updateQuantity = (id, size, quantity) => {
    dispatch({
      type: CartActionTypes.UPDATE_QUANTITY,
      payload: { id, size, quantity },
    });
  };

  const clearCart = () => {
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