import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { 
  ShoppingCart, 
  X, 
  Plus, 
  Minus, 
  Trash2,
  ArrowRight,
  CreditCard,
  Truck,
  Shield,
  Gift,
  Tag
} from 'lucide-react'

const Cart = ({ isOpen, onClose }) => {
  const { 
    items, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    totalItems, 
    totalPrice 
  } = useCart()
  
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState(null)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const shippingThreshold = 399
  const shippingCost = totalPrice >= shippingThreshold ? 0 : 150
  const promoDiscount = appliedPromo ? Math.round(totalPrice * 0.1) : 0
  const finalTotal = totalPrice + shippingCost - promoDiscount

  const promoCodes = {
    'FIRST10': { discount: 0.1, minAmount: 0 },
    'SAVE20': { discount: 0.2, minAmount: 1000 },
    'WELCOME': { discount: 0.15, minAmount: 500 }
  }

  const handlePromoCode = () => {
    const promo = promoCodes[promoCode.toUpperCase()]
    if (promo && totalPrice >= promo.minAmount) {
      setAppliedPromo({
        code: promoCode.toUpperCase(),
        discount: promo.discount
      })
    } else {
      alert('Invalid promo code or minimum amount not met')
    }
  }

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    
    try {
      // Load Razorpay script
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      document.body.appendChild(script)

      script.onload = () => {
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_1234567890', // Replace with your Razorpay key
          amount: finalTotal * 100, // Amount in paise
          currency: 'INR',
          name: 'Stickon',
          description: 'Label Purchase',
          image: '/logo192.png',
          handler: function (response) {
            // Handle successful payment
            console.log('Payment successful:', response)
            alert('Payment successful! Order ID: ' + response.razorpay_payment_id)
            clearCart()
            onClose()
          },
          prefill: {
            name: '',
            email: '',
            contact: ''
          },
          notes: {
            address: 'Stickon Corporate Office'
          },
          theme: {
            color: '#2563eb'
          },
          modal: {
            ondismiss: function() {
              setIsCheckingOut(false)
            }
          }
        }

        const rzp = new window.Razorpay(options)
        rzp.open()
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Checkout failed. Please try again.')
    } finally {
      setIsCheckingOut(false)
    }
  }

  const CartItem = ({ item }) => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm border"
    >
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 object-cover rounded-lg"
      />
      
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{item.name}</h4>
        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-blue-600">₹{item.price}</span>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="p-1 hover:bg-gray-100 rounded-full"
              disabled={item.quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <Plus className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => removeFromCart(item.id)}
              className="p-1 hover:bg-red-100 rounded-full text-red-600 ml-2"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
          />
          
          {/* Cart Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-50 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="bg-white p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Shopping Cart ({totalItems})
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Add some amazing labels to get started!
                  </p>
                  <button
                    onClick={onClose}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {items.map(item => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </AnimatePresence>

                  {/* Promo Code Section */}
                  <div className="bg-white p-4 rounded-lg shadow-sm border mt-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Tag className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-gray-900">Promo Code</span>
                    </div>
                    
                    {appliedPromo ? (
                      <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <span className="text-green-800 font-medium">{appliedPromo.code}</span>
                          <span className="text-green-600 text-sm">Applied!</span>
                        </div>
                        <button
                          onClick={() => {
                            setAppliedPromo(null)
                            setPromoCode('')
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Enter promo code"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          onClick={handlePromoCode}
                          className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Clear Cart Button */}
                  <button
                    onClick={clearCart}
                    className="w-full text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors text-center"
                  >
                    Clear All Items
                  </button>
                </div>
              )}
            </div>

            {/* Footer with Checkout */}
            {items.length > 0 && (
              <div className="bg-white border-t border-gray-200 p-6">
                {/* Shipping Info */}
                <div className="mb-4">
                  {totalPrice >= shippingThreshold ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <Truck className="w-4 h-4" />
                      <span className="text-sm font-medium">Free shipping unlocked!</span>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">
                      Add ₹{shippingThreshold - totalPrice} more for free shipping
                    </div>
                  )}
                </div>

                {/* Order Summary */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
                  </div>
                  
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedPromo.code}):</span>
                      <span>-₹{promoDiscount}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>₹{finalTotal}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCheckingOut ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Security Badge */}
                <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm mt-3">
                  <Shield className="w-4 h-4" />
                  <span>Secure checkout with Razorpay</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Cart