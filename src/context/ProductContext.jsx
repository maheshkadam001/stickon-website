import React, { createContext, useContext, useState, useEffect } from 'react'

const ProductContext = createContext()

export const useProducts = () => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider')
  }
  return context
}

const initialProducts = [
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
    tags: ['wedding', 'premium', 'gold', 'elegant'],
    inStock: true,
    featured: true,
    discount: 25,
    sales: 156,
    createdAt: '2024-01-15T10:30:00Z'
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
    tags: ['business', 'logo', 'professional'],
    inStock: true,
    featured: true,
    discount: 20,
    sales: 234,
    createdAt: '2024-01-20T14:20:00Z'
  },
  {
    id: 3,
    name: 'Organic Food Labels',
    description: 'Natural kraft paper labels for organic products',
    price: 149,
    originalPrice: 179,
    image: 'https://picsum.photos/seed/organic-food/300/300',
    category: 'food',
    rating: 4.9,
    reviews: 156,
    tags: ['organic', 'food', 'natural', 'kraft'],
    inStock: true,
    featured: false,
    discount: 17,
    sales: 89,
    createdAt: '2024-01-25T09:45:00Z'
  },
  {
    id: 4,
    name: 'Tech Startup Stickers',
    description: 'Modern tech company branding stickers',
    price: 249,
    originalPrice: 299,
    image: 'https://picsum.photos/seed/tech-startup/300/300',
    category: 'tech',
    rating: 4.7,
    reviews: 67,
    tags: ['tech', 'startup', 'modern', 'branding'],
    inStock: true,
    featured: true,
    discount: 17,
    sales: 145,
    createdAt: '2024-02-01T16:10:00Z'
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
    tags: ['kids', 'party', 'colorful', 'fun'],
    inStock: true,
    featured: false,
    discount: 23,
    sales: 298,
    createdAt: '2024-02-05T11:15:00Z'
  },
  {
    id: 6,
    name: 'Vintage Wine Labels',
    description: 'Classic wine bottle labels with vintage design',
    price: 349,
    originalPrice: 399,
    image: 'https://picsum.photos/seed/vintage-wine/300/300',
    category: 'wine',
    rating: 4.8,
    reviews: 92,
    tags: ['wine', 'vintage', 'classic', 'bottle'],
    inStock: false,
    featured: true,
    discount: 13,
    sales: 76,
    createdAt: '2024-02-10T13:30:00Z'
  },
  {
    id: 7,
    name: 'Health & Beauty Labels',
    description: 'Clean and minimalist labels for skincare products',
    price: 199,
    originalPrice: 239,
    image: 'https://picsum.photos/seed/health-beauty/300/300',
    category: 'beauty',
    rating: 4.6,
    reviews: 78,
    tags: ['beauty', 'skincare', 'clean', 'minimalist'],
    inStock: true,
    featured: false,
    discount: 17,
    sales: 123,
    createdAt: '2024-02-15T10:00:00Z'
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
    tags: ['eco', 'sustainable', 'recycled', 'green'],
    inStock: true,
    featured: true,
    discount: 10,
    sales: 187,
    createdAt: '2024-02-20T15:45:00Z'
  },
  {
    id: 9,
    name: 'Waterproof Outdoor Labels',
    description: 'Durable labels for outdoor equipment and gear',
    price: 229,
    originalPrice: 269,
    image: 'https://picsum.photos/seed/waterproof-outdoor/300/300',
    category: 'outdoor',
    rating: 4.7,
    reviews: 89,
    tags: ['waterproof', 'outdoor', 'durable', 'equipment'],
    inStock: true,
    featured: true,
    discount: 15,
    sales: 167,
    createdAt: '2024-02-25T08:30:00Z'
  },
  {
    id: 10,
    name: 'Craft & DIY Stickers',
    description: 'Creative stickers perfect for DIY projects',
    price: 129,
    originalPrice: 149,
    image: 'https://picsum.photos/seed/craft-diy/300/300',
    category: 'craft',
    rating: 4.4,
    reviews: 167,
    tags: ['craft', 'diy', 'creative', 'projects'],
    inStock: true,
    featured: false,
    discount: 13,
    sales: 245,
    createdAt: '2024-03-01T12:15:00Z'
  }
]

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    // Load products from localStorage or use initial products
    const savedProducts = localStorage.getItem('stickon_products')
    if (savedProducts) {
      try {
        return JSON.parse(savedProducts)
      } catch (error) {
        console.error('Error loading products:', error)
        return initialProducts
      }
    }
    return initialProducts
  })

  // Save products to localStorage whenever products change
  useEffect(() => {
    localStorage.setItem('stickon_products', JSON.stringify(products))
  }, [products])

  const addProduct = (productData) => {
    const newProduct = {
      id: Date.now(), // Simple ID generation
      ...productData,
      createdAt: new Date().toISOString(),
      featured: productData.featured || false,
      inStock: productData.inStock !== undefined ? productData.inStock : true,
      sales: productData.sales || 0, // Default sales to 0 for new products
      reviews: productData.reviews || 0 // Default reviews to 0 for new products
    }

    setProducts(prevProducts => [newProduct, ...prevProducts])
    return newProduct
  }

  const updateProduct = (productId, updatedData) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, ...updatedData, updatedAt: new Date().toISOString() }
          : product
      )
    )
  }

  const deleteProduct = (productId) => {
    setProducts(prevProducts =>
      prevProducts.filter(product => product.id !== productId)
    )
  }

  const getAllProducts = () => {
    return products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  const getFeaturedProducts = (count = 4) => {
    return products
      .filter(product => product.featured && product.inStock)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, count)
  }

  const getProductsByCategory = (category) => {
    return products.filter(product => product.category === category)
  }

  const searchProducts = (searchTerm) => {
    const term = searchTerm.toLowerCase()
    return products.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.tags.some(tag => tag.toLowerCase().includes(term))
    )
  }

  const getProductById = (productId) => {
    return products.find(product => product.id === parseInt(productId))
  }

  const getTotalProducts = () => {
    return products.length
  }

  const getInStockProducts = () => {
    return products.filter(product => product.inStock)
  }

  const getCategories = () => {
    const categories = [...new Set(products.map(product => product.category))]
    return categories.map(category => ({
      id: category,
      name: category.charAt(0).toUpperCase() + category.slice(1),
      count: products.filter(product => product.category === category).length
    }))
  }

  const value = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getFeaturedProducts,
    getProductsByCategory,
    searchProducts,
    getProductById,
    getTotalProducts,
    getInStockProducts,
    getCategories
  }

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}

export default ProductContext