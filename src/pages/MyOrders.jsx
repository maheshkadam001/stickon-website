import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Package, ArrowLeft } from 'lucide-react'

const MyOrders = () => {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Please Sign In</h2>
            <p className="text-gray-600 mb-6">
              You need to sign in to view your orders.
            </p>
            <Link to="/login" className="btn-primary">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-primary-600">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4">No Orders Yet</h2>
          <p className="text-gray-600 mb-8">
            You haven't placed any orders yet. Start creating your first label!
          </p>
          <Link to="/create-label" className="btn-primary">
            Create Your First Label
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MyOrders