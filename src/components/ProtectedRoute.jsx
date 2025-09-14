import React, { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { Lock, Shield, AlertTriangle, ArrowLeft } from 'lucide-react'

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth()
  const location = useLocation()

  // Show loading spinner while authentication state is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is not logged in, redirect to login with the current location
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If admin access is required but user is not admin
  if (adminOnly && !isAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full mx-4"
        >
          <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
            {/* Warning Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h1>

            {/* Message */}
            <p className="text-gray-600 mb-6">
              You don't have permission to access the admin panel. This area is restricted to administrators only.
            </p>

            {/* User Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-700">
                <Shield className="h-4 w-4" />
                <span>Current role: <span className="font-medium capitalize">{user.role || 'User'}</span></span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Logged in as: {user.email}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => window.history.back()}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Return to Home
              </button>
            </div>

            {/* Contact Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Need admin access? Contact your administrator.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // If all checks pass, render the protected component
  return children
}

export default ProtectedRoute