import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedItems, setExpandedItems] = useState({})

  const faqData = [
    {
      id: 1,
      question: "What types of labels do you offer?",
      answer: "We offer a wide variety of labels including custom stickers, product labels, shipping labels, address labels, barcode labels, waterproof labels, and promotional stickers. All labels can be fully customized with your design, text, and branding.",
      category: "Products"
    },
    {
      id: 2,
      question: "How much do custom labels cost?",
      answer: "Our pricing starts from ₹5 per label and varies based on size, material, quantity, and customization complexity. We offer volume discounts for larger orders. For specific pricing, please use our online calculator or contact our sales team.",
      category: "Pricing"
    },
    {
      id: 3,
      question: "What is the minimum order quantity?",
      answer: "We have a minimum order quantity of 50 labels for most products. However, we also offer sample packs with as few as 10 labels so you can test the quality before placing a larger order.",
      category: "Orders"
    },
    {
      id: 4,
      question: "How long does it take to produce and ship my order?",
      answer: "Standard production time is 2-3 business days, with shipping taking an additional 3-5 business days for standard delivery. Express options are available for rush orders, with production in 24 hours and express shipping in 1-2 days.",
      category: "Shipping"
    },
    {
      id: 5,
      question: "Can I see a proof before my labels are printed?",
      answer: "Yes! We provide digital proofs for all custom orders at no additional cost. You can request revisions until you're completely satisfied with the design. Production only begins after your approval.",
      category: "Design"
    },
    {
      id: 6,
      question: "Are your labels waterproof and weather resistant?",
      answer: "Yes, we offer waterproof labels made with vinyl material and weatherproof adhesives. These labels are perfect for outdoor use, bottles, and products that may be exposed to moisture or extreme temperatures.",
      category: "Products"
    },
    {
      id: 7,
      question: "Do you offer bulk discounts?",
      answer: "Absolutely! We offer tiered pricing with significant discounts for larger quantities. Discounts start at 500+ labels and increase with volume. Contact our sales team for custom quotes on large orders.",
      category: "Pricing"
    },
    {
      id: 8,
      question: "Can I track my order status?",
      answer: "Yes, you can track your order status in real-time through your account dashboard. You'll receive email updates at each stage, and once shipped, you'll get tracking information for delivery updates.",
      category: "Orders"
    },
    {
      id: 9,
      question: "What file formats do you accept for custom designs?",
      answer: "We accept various file formats including PDF, AI, EPS, PNG, JPG, and SVG. For best results, we recommend vector files (AI, EPS, SVG) at 300 DPI resolution. Our design team can also help optimize your files.",
      category: "Design"
    },
    {
      id: 10,
      question: "Do you ship internationally?",
      answer: "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by destination. Customs duties and taxes may apply depending on your country's regulations.",
      category: "Shipping"
    },
    {
      id: 11,
      question: "What is your return and refund policy?",
      answer: "We stand behind our quality. If you're not satisfied with your order due to our error or defect, we'll reprint or refund within 30 days. Custom orders are non-refundable unless there's a production error on our part.",
      category: "Policy"
    },
    {
      id: 12,
      question: "Can you help with label design?",
      answer: "Yes! We have a team of professional designers who can help create your perfect label. We also offer an AI-powered design tool and a library of templates. Design services start at ₹2000 for basic layouts.",
      category: "Design"
    }
  ]

  const categories = ['All', ...new Set(faqData.map(item => item.category))]
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredFAQ = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
        <p className="text-gray-600">Find answers to the most common questions about our labels and services</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredFAQ.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleExpand(item.id)}
                className="w-full px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mt-2">{item.question}</h3>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    {expandedItems[item.id] ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {expandedItems[item.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4">
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* No Results */}
      {filteredFAQ.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 mb-4">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
          <p className="text-gray-600">Try adjusting your search terms or category filter.</p>
        </motion.div>
      )}

      {/* Contact Support */}
      <div className="mt-12 text-center bg-blue-50 rounded-lg p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Still have questions?</h3>
        <p className="text-gray-600 mb-4">
          Can't find what you're looking for? Our support team is here to help!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200">
            Contact Support
          </button>
          <button className="bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 px-6 py-3 rounded-lg transition-colors duration-200">
            Schedule a Call
          </button>
        </div>
      </div>
    </div>
  )
}

export default FAQ