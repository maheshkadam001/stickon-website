import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])

  // Admin configuration
  const ADMIN_CREDENTIALS = {
    email: 'admin@stickon.com',
    password: 'admin123',
    role: 'admin'
  }

  const DEMO_ADMIN_CREDENTIALS = {
    email: 'demo@admin.com',
    password: 'demo123',
    role: 'admin'
  }

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const savedUser = localStorage.getItem('stickon_user')
    const savedOrders = localStorage.getItem('stickon_orders')
    
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    }
    
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // Check admin credentials first
    if ((email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) ||
        (email === DEMO_ADMIN_CREDENTIALS.email && password === DEMO_ADMIN_CREDENTIALS.password)) {
      const adminUser = {
        id: 'admin',
        email: email,
        name: 'Admin User',
        role: 'admin',
        isAdmin: true,
        createdAt: new Date().toISOString()
      }
      setUser(adminUser)
      localStorage.setItem('stickon_user', JSON.stringify(adminUser))
      return adminUser
    }
    
    // Get regular users from localStorage
    const users = JSON.parse(localStorage.getItem('stickon_users') || '[]')
    
    // Find user with matching email and password
    const user = users.find(u => u.email === email && u.password === password)
    
    if (user) {
      // Ensure regular users don't have admin privileges
      const regularUser = {
        ...user,
        role: user.role || 'user',
        isAdmin: false
      }
      setUser(regularUser)
      localStorage.setItem('stickon_user', JSON.stringify(regularUser))
      return regularUser
    } else {
      throw new Error('Invalid email or password')
    }
  }

  const register = async (userData) => {
    // Get existing users
    const users = JSON.parse(localStorage.getItem('stickon_users') || '[]')
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === userData.email)
    if (existingUser) {
      throw new Error('User with this email already exists')
    }
    
    // Create new user (ensure no admin privileges for regular registration)
    const newUser = {
      id: Date.now(),
      ...userData,
      role: 'user', // Force regular users to have 'user' role
      isAdmin: false, // Explicitly set to false
      profileImage: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Save to users array
    users.push(newUser)
    localStorage.setItem('stickon_users', JSON.stringify(users))
    
    // Set as current user
    setUser(newUser)
    localStorage.setItem('stickon_user', JSON.stringify(newUser))
    
    return newUser
  }

  const updateProfile = async (updatedData) => {
    if (!user) return
    
    const updatedUser = {
      ...user,
      ...updatedData,
      updatedAt: new Date().toISOString()
    }
    
    // Update in users array
    const users = JSON.parse(localStorage.getItem('stickon_users') || '[]')
    const userIndex = users.findIndex(u => u.id === user.id)
    if (userIndex !== -1) {
      users[userIndex] = updatedUser
      localStorage.setItem('stickon_users', JSON.stringify(users))
    }
    
    // Update current user
    setUser(updatedUser)
    localStorage.setItem('stickon_user', JSON.stringify(updatedUser))
    
    return updatedUser
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('stickon_user')
  }

  const addOrder = (order) => {
    const newOrder = {
      ...order,
      id: Date.now(),
      userId: user.id,
      status: 'Processing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    const updatedOrders = [...orders, newOrder]
    setOrders(updatedOrders)
    localStorage.setItem('stickon_orders', JSON.stringify(updatedOrders))
    
    return newOrder
  }

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId
        ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
        : order
    )
    setOrders(updatedOrders)
    localStorage.setItem('stickon_orders', JSON.stringify(updatedOrders))
  }

  const getUserOrders = () => {
    if (!user) return []
    return orders.filter(order => order.userId === user.id)
  }

  const getAllOrders = () => {
    return orders
  }

  // Admin helper functions
  const isAdmin = () => {
    return user && user.role === 'admin' && user.isAdmin === true
  }

  const requireAdmin = () => {
    if (!isAdmin()) {
      throw new Error('Admin privileges required')
    }
  }

  const value = {
    user,
    loading,
    orders,
    login,
    register,
    logout,
    updateProfile,
    addOrder,
    updateOrderStatus,
    getUserOrders,
    getAllOrders,
    isAdmin,
    requireAdmin
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}