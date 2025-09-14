import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ChatBot from '../components/ChatBot'
import FAQ from '../components/FAQ'
import CustomerRatings from '../components/CustomerRatings'
import { MessageCircle, HelpCircle, Star } from 'lucide-react'

const Support = () => {
  const [activeSection, setActiveSection] = useState('chat')

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Support Center
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Get instant help with our AI assistant, browse frequently asked questions, 
            or see what our customers are saying about us.
          </motion.p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveSection('chat')}
                className={`flex items-center px-6 py-3 rounded-md transition-all duration-200 ${
                  activeSection === 'chat'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                AI Chat
              </button>
              <button
                onClick={() => setActiveSection('faq')}
                className={`flex items-center px-6 py-3 rounded-md transition-all duration-200 ${
                  activeSection === 'faq'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <HelpCircle className="w-5 h-5 mr-2" />
                FAQ
              </button>
              <button
                onClick={() => setActiveSection('ratings')}
                className={`flex items-center px-6 py-3 rounded-md transition-all duration-200 ${
                  activeSection === 'ratings'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Star className="w-5 h-5 mr-2" />
                Customer Reviews
              </button>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-[600px]"
        >
          {activeSection === 'chat' && <ChatBot />}
          {activeSection === 'faq' && <FAQ />}
          {activeSection === 'ratings' && <CustomerRatings />}
        </motion.div>
      </div>
    </div>
  )
}

export default Support