import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ReviewProvider } from './context/ReviewContext'
import { ProductProvider } from './context/ProductContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Cart from './components/Cart'
import Home from './pages/Home'
import CreateLabel from './pages/CreateLabel'
import AIDesigner from './pages/AIDesigner'
import LabelInspiration from './pages/LabelInspiration'
import MyOrders from './pages/MyOrders'
import Contact from './pages/Contact'
import Support from './pages/Support'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Favourites from './pages/Favourites'
import CustomerReviews from './pages/CustomerReviews'
import Admin from './pages/Admin'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <AuthProvider>
      <CartProvider>
        <ReviewProvider>
          <ProductProvider>
            <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar onCartClick={() => setIsCartOpen(true)} />
            <main className="pb-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create-label" element={<CreateLabel />} />
                <Route path="/ai-designer" element={<AIDesigner />} />
                <Route path="/label-inspiration" element={<LabelInspiration />} />
                <Route path="/my-orders" element={<MyOrders />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/support" element={<Support />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/favourites" element={<Favourites />} />
                <Route path="/customer-reviews" element={<CustomerReviews />} />
                <Route path="/admin" element={
                  <ProtectedRoute adminOnly={true}>
                    <Admin />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer />
            <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          </div>
            </Router>
          </ProductProvider>
        </ReviewProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
