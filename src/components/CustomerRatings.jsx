import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReviews } from '../context/ReviewContext'
import { Star, User, Quote, ThumbsUp, Calendar, Award } from 'lucide-react'

const CustomerRatings = () => {
  const { getAllReviews, addReview, getAverageRating, getTotalReviews } = useReviews()
  const [showRatingForm, setShowRatingForm] = useState(false)
  const [newRating, setNewRating] = useState({
    rating: 0,
    name: '',
    email: '',
    title: '',
    review: ''
  })
  const [hoverRating, setHoverRating] = useState(0)
  const [sortBy, setSortBy] = useState('newest')

  // Get reviews from context
  const reviews = getAllReviews()
  const averageRating = parseFloat(getAverageRating())
  const totalReviews = getTotalReviews()

  // Rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(review => review.rating === star).length,
    percentage: (reviews.filter(review => review.rating === star).length / totalReviews) * 100
  }))

  const handleRatingSubmit = (e) => {
    e.preventDefault()
    if (newRating.rating === 0 || !newRating.name || !newRating.review) return

    const reviewData = {
      name: newRating.name,
      rating: newRating.rating,
      content: newRating.review,
      role: newRating.title || 'Customer' // Use title as role or default to 'Customer'
    }

    addReview(reviewData)
    setNewRating({ rating: 0, name: '', email: '', title: '', review: '' })
    setShowRatingForm(false)
  }

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt)
      case 'highest':
        return b.rating - a.rating
      case 'lowest':
        return a.rating - b.rating
      case 'helpful':
        return (b.helpful || 0) - (a.helpful || 0)
      default:
        return 0
    }
  })

  const StarRating = ({ rating, interactive = false, size = 'w-5 h-5', onRate }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : 'button'}
            disabled={!interactive}
            onClick={() => interactive && onRate && onRate(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'} focus:outline-none`}
          >
            <Star
              className={`${size} ${
                star <= (interactive ? (hoverRating || rating) : rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              } transition-colors duration-200`}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
        <p className="text-gray-600">Read reviews from satisfied customers and share your experience</p>
      </div>

      {/* Rating Summary */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="text-6xl font-bold text-gray-900 mr-4">
                {averageRating.toFixed(1)}
              </div>
              <div>
                <StarRating rating={Math.round(averageRating)} size="w-8 h-8" />
                <p className="text-gray-600 mt-2">Based on {totalReviews} reviews</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">Excellent Rating</span>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-3">
            {ratingDistribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700 w-8">{star}</span>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
        <button
          onClick={() => setShowRatingForm(!showRatingForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
        >
          Write a Review
        </button>
      </div>

      {/* Rating Form */}
      <AnimatePresence>
        {showRatingForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Write Your Review</h3>
            <form onSubmit={handleRatingSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={newRating.name}
                    onChange={(e) => setNewRating({ ...newRating, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={newRating.email}
                    onChange={(e) => setNewRating({ ...newRating, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
                <StarRating
                  rating={newRating.rating}
                  interactive={true}
                  size="w-8 h-8"
                  onRate={(rating) => setNewRating({ ...newRating, rating })}
                />
              </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Role/Business</label>
                  <input
                    type="text"
                    value={newRating.title}
                    onChange={(e) => setNewRating({ ...newRating, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Small Business Owner, Event Planner"
                  />
                </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Review *</label>
                <textarea
                  required
                  rows="4"
                  value={newRating.review}
                  onChange={(e) => setNewRating({ ...newRating, review: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Share your experience with our products and services..."
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowRatingForm(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      <div className="space-y-6">
        {sortedReviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
                    {review.avatar ? (
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-semibold text-gray-900">{review.name}</h4>
                        <span className="text-gray-500 text-sm">{review.role}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-3">
                      <StarRating rating={review.rating} />
                    </div>
                    
                    <div className="relative">
                      <Quote className="absolute top-0 left-0 w-6 h-6 text-gray-300" />
                      <p className="text-gray-600 leading-relaxed pl-8">{review.content}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors duration-200">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm">Helpful ({review.helpful || 0})</span>
                      </button>
                      {/* New badge for recent reviews */}
                      {new Date() - new Date(review.createdAt) < 7 * 24 * 60 * 60 * 1000 && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                </div>
          </motion.div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12 bg-blue-50 rounded-xl p-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Ready to Experience Our Quality?</h3>
        <p className="text-gray-600 mb-6">
          Join thousands of satisfied customers who trust StickoN for their labeling needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors duration-200">
            Order Now
          </button>
          <button className="bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 px-8 py-3 rounded-lg transition-colors duration-200">
            Request Samples
          </button>
        </div>
      </div>
    </div>
  )
}

export default CustomerRatings