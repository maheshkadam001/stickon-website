import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useReviews } from '../context/ReviewContext'
import { useProducts } from '../context/ProductContext'
import { 
  ArrowRight, 
  Palette, 
  Download, 
  Truck,
  Star,
  CheckCircle,
  Zap,
  Shield,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const Home = () => {
  const { getAllReviews, getAverageRating, getTotalReviews } = useReviews()
  const { getAllProducts } = useProducts()
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)
  const [displayedReviews, setDisplayedReviews] = useState([])
  const [currentProductIndex, setCurrentProductIndex] = useState(0)
  const [displayedProducts, setDisplayedProducts] = useState([])
  
  // Get all reviews and update displayed reviews
  useEffect(() => {
    const allReviews = getAllReviews()
    setDisplayedReviews(allReviews)
  }, [getAllReviews])

  // Get all products and update displayed products
  useEffect(() => {
    const allProducts = getAllProducts()
    setDisplayedProducts(allProducts)
  }, [getAllProducts])

  // Auto-rotate reviews every 4 seconds
  useEffect(() => {
    if (displayedReviews.length > 3) {
      const interval = setInterval(() => {
        setCurrentReviewIndex(prev => (prev + 1) % (displayedReviews.length - 2))
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [displayedReviews.length])

  // Auto-rotate products every 5 seconds (different timing from reviews)
  useEffect(() => {
    if (displayedProducts.length > 4) {
      const interval = setInterval(() => {
        setCurrentProductIndex(prev => (prev + 1) % (displayedProducts.length - 3))
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [displayedProducts.length])

  // Get current 3 reviews to display
  const getCurrentReviews = () => {
    if (displayedReviews.length <= 3) return displayedReviews
    return displayedReviews.slice(currentReviewIndex, currentReviewIndex + 3)
  }

  // Get current 4 products to display
  const getCurrentProducts = () => {
    if (displayedProducts.length <= 4) return displayedProducts
    return displayedProducts.slice(currentProductIndex, currentProductIndex + 4)
  }

  const features = [
    {
      icon: <Palette className="h-8 w-8 text-primary-600" />,
      title: "Easy Design Tools",
      description: "Drag-and-drop editor with templates, fonts, and graphics"
    },
    {
      icon: <Zap className="h-8 w-8 text-primary-600" />,
      title: "AI-Powered Design",
      description: "Generate professional labels with simple text descriptions"
    },
    {
      icon: <Download className="h-8 w-8 text-primary-600" />,
      title: "Multiple Formats",
      description: "Download in PNG, JPG, PDF, or SVG formats"
    },
    {
      icon: <Truck className="h-8 w-8 text-primary-600" />,
      title: "Fast Delivery",
      description: "Quick printing and delivery to your doorstep"
    }
  ]



  const stats = [
    { number: "500+", label: "Labels Created" },
    { number: "50+", label: "Happy Customers" },
    { number: "99.8%", label: "Uptime" },
    { number: "24/7", label: "Support" }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Create Custom Labels
              <span className="block gradient-text">In Minutes</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Design professional labels for water bottles, jars, packaging, and more. 
              Choose from our easy drag-and-drop editor or let AI create the perfect design for you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/create-label"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2"
              >
                <span>Create Your Label</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/ai-designer"
                className="btn-secondary text-lg px-8 py-4 inline-flex items-center space-x-2"
              >
                <Zap className="h-5 w-5" />
                <span>Try AI Designer</span>
              </Link>
            </div>
          </div>

          {/* Hero Image/Demo */}
          <div className="mt-16">
            <div className="bg-white rounded-2xl shadow-2xl p-8 mx-auto max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Design Process</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary-100 p-2 rounded-full">
                        <CheckCircle className="h-5 w-5 text-primary-600" />
                      </div>
                      <span>Choose your label size and shape</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary-100 p-2 rounded-full">
                        <CheckCircle className="h-5 w-5 text-primary-600" />
                      </div>
                      <span>Design with our editor or AI</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary-100 p-2 rounded-full">
                        <CheckCircle className="h-5 w-5 text-primary-600" />
                      </div>
                      <span>Preview and download or order print</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <div className="w-48 h-32 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-gray-600 font-medium">Label Preview</span>
                  </div>
                  <p className="text-gray-500">See your design in real-time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose StickOn?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional label design and printing made simple with cutting-edge tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300">
                <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Stickers Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              New Stickers Collection
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our latest professionally designed stickers and labels
            </p>
          </div>

          <div className="relative">
            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 transition-all duration-500">
              {getCurrentProducts().map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                  {/* Discount Badge */}
                  {product.discount > 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
                      -{product.discount}%
                    </div>
                  )}
                  
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    
                    {/* Star Rating */}
                    <div className="flex items-center mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-blue-600">₹{product.price}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                      {product.featured && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Featured</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Controls */}
            {displayedProducts.length > 4 && (
              <div className="flex items-center justify-center space-x-4 mb-8">
                <button
                  onClick={() => setCurrentProductIndex(prev => 
                    prev === 0 ? displayedProducts.length - 4 : prev - 1
                  )}
                  className="p-2 rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors duration-200"
                  aria-label="Previous products"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                <div className="flex space-x-2">
                  {Array.from({ length: Math.max(1, displayedProducts.length - 3) }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentProductIndex(i)}
                      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                        i === currentProductIndex ? 'bg-primary-600' : 'bg-gray-300'
                      }`}
                      aria-label={`Go to product set ${i + 1}`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentProductIndex(prev => 
                    (prev + 1) % (displayedProducts.length - 3)
                  )}
                  className="p-2 rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors duration-200"
                  aria-label="Next products"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          <div className="text-center">
            <Link
              to="/label-inspiration"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <span>View All Stickers</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-primary-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join {getTotalReviews()} satisfied customers who trust StickOn for their labeling needs
            </p>
            <div className="flex items-center justify-center space-x-4 mt-4">
              <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="text-lg font-semibold text-gray-900">{getAverageRating()}</span>
                <span className="text-gray-600">({getTotalReviews()} reviews)</span>
              </div>
            </div>
          </div>

          <div className="relative">
            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-500">
              {getCurrentReviews().map((review) => (
                <div key={review.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-12 h-12 rounded-full mr-3 object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{review.name}</div>
                      <div className="text-gray-500 text-sm">{review.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-gray-500 text-sm ml-2">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 italic">"{review.content}"</p>
                </div>
              ))}
            </div>

            {/* Navigation Controls */}
            {displayedReviews.length > 3 && (
              <div className="flex items-center justify-center space-x-4 mt-8">
                <button
                  onClick={() => setCurrentReviewIndex(prev => 
                    prev === 0 ? displayedReviews.length - 3 : prev - 1
                  )}
                  className="p-2 rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors duration-200"
                  aria-label="Previous reviews"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                <div className="flex space-x-2">
                  {Array.from({ length: Math.max(1, displayedReviews.length - 2) }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentReviewIndex(i)}
                      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                        i === currentReviewIndex ? 'bg-primary-600' : 'bg-gray-300'
                      }`}
                      aria-label={`Go to review set ${i + 1}`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentReviewIndex(prev => 
                    (prev + 1) % (displayedReviews.length - 2)
                  )}
                  className="p-2 rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors duration-200"
                  aria-label="Next reviews"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* View All Reviews Button */}
          <div className="text-center mt-12">
            <Link
              to="/customer-reviews"
              className="btn-secondary inline-flex items-center space-x-2"
            >
              <span>View All Reviews</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Create Your Perfect Label?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Join thousands of customers who trust StickOn for professional, high-quality custom labels
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/create-label"
              className="bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 inline-flex items-center space-x-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home