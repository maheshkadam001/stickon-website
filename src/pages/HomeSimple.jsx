import React from 'react'
import { Link } from 'react-router-dom'

const HomeSimple = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          Create Custom Labels
          <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            In Minutes
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Design professional labels for water bottles, jars, packaging, and more. 
          Choose from our easy drag-and-drop editor or let AI create the perfect design for you.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg">
            Create Your Label
          </button>
          <button className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-4 px-8 rounded-lg text-lg">
            Try AI Designer
          </button>
        </div>
      </div>
    </div>
  )
}

export default HomeSimple