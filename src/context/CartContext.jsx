import React, { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext()

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload || []
      }

    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.id === action.payload.id)
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
              : item
          )
        }
      } else {
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }]
        }
      }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      }

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        )
      }

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      }

    case 'SET_SHIPPING_ADDRESS':
      return {
        ...state,
        shippingAddress: action.payload
      }

    case 'SET_ORDER_LOADING':
      return {
        ...state,
        orderLoading: action.payload
      }

    default:
      return state
  }
}

const initialState = {
  items: [],
  shippingAddress: null,
  orderLoading: false
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('stickon-cart')
    if (savedCart) {
      try {
        dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) })
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('stickon-cart', JSON.stringify(state.items))
  }, [state.items])

  // Cart helper functions
  const addToCart = (product, quantity = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity } })
  }

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId })
  }

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const setShippingAddress = (address) => {
    dispatch({ type: 'SET_SHIPPING_ADDRESS', payload: address })
  }

  const setOrderLoading = (loading) => {
    dispatch({ type: 'SET_ORDER_LOADING', payload: loading })
  }

  // Calculate cart totals
  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getCartItemsCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0)
  }

  const getShippingCost = () => {
    const total = getCartTotal()
    return total > 2000 ? 0 : 100 // Free shipping above ₹2000
  }

  const getFinalTotal = () => {
    return getCartTotal() + getShippingCost()
  }

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setShippingAddress,
    setOrderLoading,
    getCartTotal,
    getCartItemsCount,
    getShippingCost,
    getFinalTotal
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export default CartContext