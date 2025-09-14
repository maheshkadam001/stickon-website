import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductContext'
import { 
  Search, 
  Filter, 
  Star, 
  ShoppingCart, 
  Heart, 
  Eye,
  Grid3X3,
  List,
  SlidersHorizontal,
  Plus,
  Minus,
  ChevronDown,
  X,
  Check,
  Truck,
  Shield
} from 'lucide-react'

const LabelInspiration = () => {
  const { addToCart, items: cartItems } = useCart()
  const { getAllProducts, getCategories } = useProducts()
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [wishlist, setWishlist] = useState([])
  
  const products = getAllProducts()

  // Get categories from ProductContext
  const categories = [
    { id: 'all', name: 'All Categories', count: products.length },
    ...getCategories()
  ]

  useEffect(() => {
    setFilteredProducts(products)
  }, [products])

  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      
      return matchesSearch && matchesCategory && matchesPrice
    })

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        filtered.sort((a, b) => b.id - a.id)
        break
      case 'featured':
      default:
        filtered.sort((a, b) => b.featured - a.featured)
        break
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedCategory, priceRange, sortBy])

  const handleAddToCart = (product) => {
    addToCart(product)
    // You could add a toast notification here
  }

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId)
  }

  const StarRating = ({ rating, reviews }) => (
    <div className="flex items-center space-x-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-gray-600">({reviews})</span>
    </div>
  )

  const ProductCard = ({ product }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden group relative"
    >
      {/* Discount Badge */}
      {product.discount > 0 && (
        <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
          -{product.discount}%
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={() => toggleWishlist(product.id)}
        className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors z-10"
      >
        <Heart 
          className={`w-5 h-5 ${
            wishlist.includes(product.id) 
              ? 'fill-red-500 text-red-500' 
              : 'text-gray-400 hover:text-red-500'
          }`}
        />
      </button>

      {/* Product Image */}
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <StarRating rating={product.rating} reviews={product.reviews} />

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">
              ₹{product.price}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          <button
            onClick={() => handleAddToCart(product)}
            disabled={!product.inStock}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              product.inStock
                ? isInCart(product.id)
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {!product.inStock ? 'Out of Stock' : 
             isInCart(product.id) ? (
               <><Check className="w-4 h-4 inline mr-1" /> Added</>
             ) : (
               <><Plus className="w-4 h-4 inline mr-1" /> Add to Cart</>
             )}
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {product.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">New Stickers</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our latest collection of professionally designed stickers and labels
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search stickers, categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filter & View Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>

              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                className="w-80 bg-white rounded-lg shadow-lg p-6 h-fit sticky top-4"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Categories</h4>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <label key={category.id} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          value={category.id}
                          checked={selectedCategory === category.id}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="flex-1">{category.name}</span>
                        <span className="text-gray-500 text-sm">({category.count})</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₹0</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Availability</h4>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" className="text-blue-600 focus:ring-blue-500" />
                    <span>In Stock Only</span>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </p>
              
              {/* Free Shipping Banner */}
              <div className="flex items-center space-x-2 text-green-600">
                <Truck className="w-4 h-4" />
                <span className="text-sm font-medium">Free shipping above ₹399</span>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* No Results */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex items-center justify-center space-x-3">
              <Shield className="w-8 h-8 text-green-600" />
              <div>
                <h4 className="font-semibold">Secure Payments</h4>
                <p className="text-gray-600 text-sm">100% secure with Razorpay</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Truck className="w-8 h-8 text-blue-600" />
              <div>
                <h4 className="font-semibold">Fast Shipping</h4>
                <p className="text-gray-600 text-sm">Free delivery above ₹399</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Star className="w-8 h-8 text-yellow-500" />
              <div>
                <h4 className="font-semibold">Premium Quality</h4>
                <p className="text-gray-600 text-sm">Professional grade labels</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LabelInspiration