import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProducts } from '../context/ProductContext'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Eye,
  Search,
  Filter,
  Package,
  DollarSign,
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Upload,
  Image as ImageIcon
} from 'lucide-react'

const Admin = () => {
  const { 
    getAllProducts, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    getCategories,
    getTotalProducts 
  } = useProducts()
  
  const products = getAllProducts()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRevenue: 0,
    averageRating: 0,
    outOfStock: 0
  })

  const allCategories = getCategories()
  const categories = allCategories.map(cat => cat.id)

  const initialProductForm = {
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    image: '',
    category: 'business',
    tags: '',
    inStock: true,
    featured: false
  }

  const [productForm, setProductForm] = useState(initialProductForm)

  useEffect(() => {
    // Calculate stats from ProductContext data
    const totalRevenue = products.reduce((sum, product) => {
      // Use sales property or default to 0 if not present
      const sales = product.sales || 0
      return sum + (product.price * sales)
    }, 0)
    
    const averageRating = products.length > 0 
      ? products.reduce((sum, product) => sum + (product.rating || 0), 0) / products.length
      : 0
    
    const outOfStock = products.filter(product => !product.inStock).length

    setStats({
      totalProducts: products.length,
      totalRevenue,
      averageRating: averageRating.toFixed(1),
      outOfStock
    })
  }, [products])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleCreateProduct = () => {
    setProductForm(initialProductForm)
    setIsCreating(true)
    setIsEditing(true)
  }

  const handleEditProduct = (product) => {
    setProductForm({
      ...product,
      tags: product.tags.join(', '),
      price: product.price.toString(),
      originalPrice: product.originalPrice.toString()
    })
    setSelectedProduct(product)
    setIsEditing(true)
    setIsCreating(false)
  }

  const handleSaveProduct = () => {
    const tagsArray = productForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    const discount = productForm.originalPrice && productForm.price 
      ? Math.round(((parseFloat(productForm.originalPrice) - parseFloat(productForm.price)) / parseFloat(productForm.originalPrice)) * 100)
      : 0

    const productData = {
      ...productForm,
      price: parseFloat(productForm.price),
      originalPrice: parseFloat(productForm.originalPrice) || parseFloat(productForm.price),
      tags: tagsArray,
      discount,
      rating: selectedProduct?.rating || 4.5, // Default rating for new products
      reviews: selectedProduct?.reviews || 0,
      sales: selectedProduct?.sales || 0
    }

    if (isCreating) {
      addProduct(productData)
    } else {
      updateProduct(selectedProduct.id, productData)
    }

    handleCancelEdit()
  }

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setIsCreating(false)
    setSelectedProduct(null)
    setProductForm(initialProductForm)
  }

  const StatsCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              {trend}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )

  const ProductForm = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {isCreating ? 'Create New Product' : 'Edit Product'}
            </h2>
            <button onClick={handleCancelEdit} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                value={productForm.name}
                onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={productForm.category}
                onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input
                type="number"
                value={productForm.price}
                onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₹)</label>
              <input
                type="number"
                value={productForm.originalPrice}
                onChange={(e) => setProductForm({...productForm, originalPrice: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={productForm.description}
              onChange={(e) => setProductForm({...productForm, description: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter product description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={productForm.image}
                onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter image URL"
              />
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Upload</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              value={productForm.tags}
              onChange={(e) => setProductForm({...productForm, tags: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="tag1, tag2, tag3"
            />
          </div>

          <div className="flex space-x-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={productForm.inStock}
                onChange={(e) => setProductForm({...productForm, inStock: e.target.checked})}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">In Stock</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={productForm.featured}
                onChange={(e) => setProductForm({...productForm, featured: e.target.checked})}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Featured Product</span>
            </label>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex space-x-3">
          <button
            onClick={handleSaveProduct}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Product</span>
          </button>
          <button
            onClick={handleCancelEdit}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  )

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="aspect-square relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex space-x-1">
          {product.featured && (
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
              Featured
            </span>
          )}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            product.inStock 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-blue-600">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600">{product.rating} ({product.reviews})</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Sales: {product.sales}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleEditProduct(product)}
              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteProduct(product.id)}
              className="p-1 text-red-600 hover:bg-red-50 rounded"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your product catalog</p>
            </div>
            <button
              onClick={handleCreateProduct}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Products"
            value={stats.totalProducts}
            icon={Package}
            color="bg-blue-100 text-blue-600"
            trend="+2 this month"
          />
          <StatsCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            color="bg-green-100 text-green-600"
            trend="+12% this month"
          />
          <StatsCard
            title="Avg. Rating"
            value={stats.averageRating}
            icon={Star}
            color="bg-yellow-100 text-yellow-600"
          />
          <StatsCard
            title="Out of Stock"
            value={stats.outOfStock}
            icon={AlertCircle}
            color="bg-red-100 text-red-600"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2 text-gray-600">
              <span className="text-sm">Showing {filteredProducts.length} of {products.length} products</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredProducts.map(product => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      <AnimatePresence>
        {isEditing && <ProductForm />}
      </AnimatePresence>
    </div>
  )
}

export default Admin
