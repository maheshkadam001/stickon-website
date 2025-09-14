import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Loader2 } from 'lucide-react'

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. I can help you with questions about StickoN labels, pricing, orders, and more. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  // Predefined responses for common questions
  const botResponses = {
    greeting: [
      "Hello! How can I assist you today?",
      "Hi there! What can I help you with?",
      "Welcome to StickoN support! How may I help you?"
    ],
    pricing: [
      "Our pricing depends on the type and quantity of labels you need. We offer competitive rates starting from ₹5 per label. Would you like me to provide specific pricing for your requirements?"
    ],
    orders: [
      "I can help you with order-related questions. You can check your order status in the 'My Orders' section. Is there a specific order you'd like to inquire about?"
    ],
    labels: [
      "We offer various types of labels including custom stickers, product labels, shipping labels, and more. Our labels are high-quality, waterproof, and available in multiple sizes. What type of label are you looking for?"
    ],
    shipping: [
      "We offer fast shipping options including standard (3-5 business days) and express (1-2 business days). Shipping is free for orders over ₹399. Would you like more details about shipping to your location?"
    ],
    customization: [
      "Yes! We offer full customization for all our labels. You can upload your own design, use our AI designer, or work with our design team. The customization process is easy and user-friendly."
    ],
    quality: [
      "Our labels are made from premium materials that are waterproof, fade-resistant, and durable. We use high-quality adhesives that ensure your labels stay put. All products go through rigorous quality testing."
    ],
    default: [
      "I understand you have a question. Let me help you find the right information. Could you provide more details about what you're looking for?",
      "That's a great question! While I may not have the exact answer, I'd be happy to connect you with our support team for detailed assistance.",
      "I'm here to help! Could you rephrase your question or provide more context so I can better assist you?"
    ]
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getRandomResponse = (responses) => {
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase()
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return getRandomResponse(botResponses.greeting)
    } else if (message.includes('price') || message.includes('cost') || message.includes('pricing')) {
      return getRandomResponse(botResponses.pricing)
    } else if (message.includes('order') || message.includes('status') || message.includes('track')) {
      return getRandomResponse(botResponses.orders)
    } else if (message.includes('label') || message.includes('sticker') || message.includes('product')) {
      return getRandomResponse(botResponses.labels)
    } else if (message.includes('ship') || message.includes('delivery') || message.includes('shipping')) {
      return getRandomResponse(botResponses.shipping)
    } else if (message.includes('custom') || message.includes('design') || message.includes('personalize')) {
      return getRandomResponse(botResponses.customization)
    } else if (message.includes('quality') || message.includes('material') || message.includes('durable')) {
      return getRandomResponse(botResponses.quality)
    } else {
      return getRandomResponse(botResponses.default)
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: generateBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000) // Random delay between 1-2 seconds
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickQuestions = [
    "What types of labels do you offer?",
    "How much do custom labels cost?",
    "How can I track my order?",
    "Do you offer bulk discounts?",
    "How long does shipping take?"
  ]

  const handleQuickQuestion = (question) => {
    setInputMessage(question)
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
        <div className="flex items-center">
          <div className="bg-white p-2 rounded-full mr-3">
            <Bot className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-white font-semibold">AI Support Assistant</h2>
            <p className="text-blue-100 text-sm">Always here to help you</p>
          </div>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="p-4 bg-gray-50 border-b">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Questions:</h3>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuickQuestion(question)}
              className="text-sm bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-full border border-gray-200 hover:border-blue-300 transition-colors duration-200"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start max-w-xs lg:max-w-md ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex-shrink-0 ${message.sender === 'user' ? 'ml-2' : 'mr-2'}`}>
                  {message.sender === 'user' ? (
                    <div className="bg-blue-600 p-2 rounded-full">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="bg-gray-300 p-2 rounded-full">
                      <Bot className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                </div>
                <div
                  className={`px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-start">
              <div className="bg-gray-300 p-2 rounded-full mr-2">
                <Bot className="w-4 h-4 text-gray-600" />
              </div>
              <div className="bg-gray-200 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-1">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-gray-600">Typing...</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatBot