import React from 'react'
import { Link } from 'react-router-dom'

const NavbarSimple = () => {
  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  StickOn
                </h1>
                <p className="text-xs text-gray-500">Design. Print. Stick.</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
              Home
            </Link>
            <Link to="/create" className="text-gray-700 hover:text-blue-600 font-medium">
              Create Label
            </Link>
            <Link to="/ai" className="text-gray-700 hover:text-blue-600 font-medium">
              AI Designer
            </Link>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavbarSimple