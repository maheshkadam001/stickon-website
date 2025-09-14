import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { 
  Heart, 
  ArrowLeft, 
  ShoppingCart, 
  Trash2, 
  Star,
  Plus,
  Eye,
  Filter,
  Grid3X3,
  List,
  Search,
  Package
} from 'lucide-react'

const Favourites = () => {
  const { user } = useAuth()
  const { addToCart, getCartItemsCount } = useCart()
  const navigate = useNavigate()
  
  const [favourites, setFavourites] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState('grid')
  const [filteredFavourites, setFilteredFavourites] = useState([])

  // Redirect if not logged in
  if (!user) {
    navigate('/login')
    return null
  }

  // Sample favourite items (in real app, this would come from user's saved items)
  const sampleFavourites = [
    {
      id: 1,
      name: 'Premium Wedding Labels',
      description: 'Elegant wedding favor labels with gold foil accents',
      price: 299,
      originalPrice: 399,
      image: 'https://picsum.photos/seed/wedding-labels/300/300',
      category: 'wedding',
      rating: 4.8,
      reviews: 124,
      inStock: true,
      discount: 25,
      dateAdded: '2024-02-15T10:30:00Z'
    },
    {
      id: 2,
      name: 'Business Logo Stickers',
      description: 'Professional business stickers for branding',
      price: 199,
      originalPrice: 249,
      image: 'https://picsum.photos/seed/business-stickers/300/300',
      category: 'business',
      rating: 4.6,
      reviews: 89,
      inStock: true,
      discount: 20,
      dateAdded: '2024-02-10T14:20:00Z'
    },
    {
      id: 5,
      name: 'Kids Party Labels',
      description: 'Colorful and fun labels for children\'s parties',
      price: 99,
      originalPrice: 129,
      image: 'https://picsum.photos/seed/kids-party/300/300',
      category: 'kids',
      rating: 4.5,
      reviews: 203,
      inStock: true,
      discount: 23,
      dateAdded: '2024-02-08T16:45:00Z'
    },
    {
      id: 8,
      name: 'Eco-Friendly Labels',
      description: 'Sustainable labels made from recycled materials',
      price: 179,
      originalPrice: 199,
      image: 'https://picsum.photos/seed/eco-labels/300/300',
      category: 'eco',
      rating: 4.9,
      reviews: 134,
      inStock: true,
      discount: 10,
      dateAdded: '2024-02-05T09:15:00Z'
    }
  ]

  // Load favourites from localStorage or use sample data
  useEffect(() => {
    const savedFavourites = localStorage.getItem(`stickon_favourites_${user.id}`)
    if (savedFavourites) {
      try {
        setFavourites(JSON.parse(savedFavourites))
      } catch (error) {
        console.error('Error loading favourites:', error)
        setFavourites(sampleFavourites)
      }
    } else {
      setFavourites(sampleFavourites)
      localStorage.setItem(`stickon_favourites_${user.id}`, JSON.stringify(sampleFavourites))
    }
  }, [user.id])

  // Filter and sort favourites
  useEffect(() => {
    let filtered = favourites.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
      
      return matchesSearch && matchesCategory
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
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
        break
    }

    setFilteredFavourites(filtered)
  }, [favourites, searchTerm, selectedCategory, sortBy])

  const removeFavourite = (itemId) => {
    const updatedFavourites = favourites.filter(item => item.id !== itemId)
    setFavourites(updatedFavourites)
    localStorage.setItem(`stickon_favourites_${user.id}`, JSON.stringify(updatedFavourites))
  }

  const handleAddToCart = (item) => {
    addToCart(item)
    // Optional: Show success message
  }

  const clearAllFavourites = () => {
    if (window.confirm('Are you sure you want to remove all items from your favourites?')) {
      setFavourites([])
      localStorage.removeItem(`stickon_favourites_${user.id}`)
    }
  }

  const addAllToCart = () => {
    favourites.forEach(item => {
      if (item.inStock) {
        addToCart(item)
      }
    })
  }

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'wedding', name: 'Wedding & Events' },
    { id: 'business', name: 'Business & Corporate' },
    { id: 'kids', name: 'Kids & Family' },
    { id: 'eco', name: 'Eco-Friendly' }
  ]

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

  const FavouriteCard = ({ item }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
      {/* Discount Badge */}
      {item.discount > 0 && (
        <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
          -{item.discount}%
        </div>
      )}

      {/* Remove Button */}
      <button
        onClick={() => removeFavourite(item.id)}
        className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors z-10 group-hover:opacity-100 opacity-0"
      >
        <Trash2 className="w-4 h-4 text-red-500" />
      </button>

      {/* Product Image */}
      <div className="aspect-square overflow-hidden relative">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
      </div>

      {/* Product Info */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {item.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3">
          {item.description}
        </p>

        <StarRating rating={item.rating} reviews={item.reviews} />

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">
              ₹{item.price}
            </span>
            {item.originalPrice > item.price && (
              <span className="text-sm text-gray-500 line-through">
                ₹{item.originalPrice}
              </span>
            )}
          </div>

          <button
            onClick={() => handleAddToCart(item)}
            disabled={!item.inStock}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              item.inStock
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {!item.inStock ? 'Out of Stock' : (
              <>
                <ShoppingCart className="w-4 h-4 inline mr-1" />
                Add to Cart
              </>
            )}
          </button>
        </div>

        <div className="text-xs text-gray-500 mt-3">
          Added {new Date(item.dateAdded).toLocaleDateString()}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="flex items-center text-gray-600 hover:text-primary-600 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Favourites</h1>
              <p className="text-xl text-gray-600">
                {favourites.length} saved {favourites.length === 1 ? 'item' : 'items'}
              </p>
            </div>
            
            {favourites.length > 0 && (
              <div className="flex space-x-4">
                <button
                  onClick={addAllToCart}
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add All to Cart</span>
                </button>
                <button
                  onClick={clearAllFavourites}
                  className="btn-outline text-red-600 border-red-600 hover:bg-red-50"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>

        {favourites.length > 0 ? (
          <>
            {/* Search and Filter Controls */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search favourites..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                {/* Filters */}
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="name">Name A-Z</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>

                  <div className="flex border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-600'}`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-600'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Favourites Grid */}
            {filteredFavourites.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'grid-cols-1'
              }`}>
                {filteredFavourites.map(item => (
                  <FavouriteCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No items match your search</h3>
                <p className="text-gray-600">Try adjusting your search terms or filters.</p>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <Heart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Your favourites list is empty</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start exploring our collection and save items you love to see them here.
            </p>
            <Link
              to="/label-inspiration"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Package className="h-4 w-4" />
              <span>Browse Products</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Favourites