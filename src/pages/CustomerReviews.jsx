import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useReviews } from '../context/ReviewContext'
import { useAuth } from '../context/AuthContext'
import { 
  Star, 
  ArrowLeft, 
  Plus, 
  User,
  MessageSquare,
  Calendar,
  TrendingUp
} from 'lucide-react'

const CustomerReviews = () => {
  const { getAllReviews, addReview, getAverageRating, getTotalReviews } = useReviews()
  const { user } = useAuth()
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    role: '',
    content: '',
    rating: 5
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const allReviews = getAllReviews()

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleRatingChange = (rating) => {
    setFormData({
      ...formData,
      rating
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Validation
    if (!formData.name || !formData.role || !formData.content) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    if (formData.content.length < 10) {
      setError('Review content must be at least 10 characters long')
      setLoading(false)
      return
    }

    try {
      await addReview(formData)
      setSuccess('Thank you! Your review has been submitted successfully.')
      setFormData({
        name: user?.name || '',
        role: '',
        content: '',
        rating: 5
      })
      setShowReviewForm(false)
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to submit review. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Customer Reviews</h1>
          <p className="text-xl text-gray-600">
            See what our customers are saying about StickOn
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
            <TrendingUp className="h-8 w-8 text-primary-600 mx-auto mb-4" />
            <div className="text-2xl font-bold text-gray-900">{getAverageRating()}</div>
            <div className="text-gray-600">Average Rating</div>
            <div className="flex justify-center mt-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${
                    i < Math.round(getAverageRating()) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`} 
                />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
            <MessageSquare className="h-8 w-8 text-primary-600 mx-auto mb-4" />
            <div className="text-2xl font-bold text-gray-900">{getTotalReviews()}</div>
            <div className="text-gray-600">Total Reviews</div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
            <Star className="h-8 w-8 text-primary-600 mx-auto mb-4" />
            <div className="text-2xl font-bold text-gray-900">
              {allReviews.filter(r => r.rating === 5).length}
            </div>
            <div className="text-gray-600">5-Star Reviews</div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
            <Calendar className="h-8 w-8 text-primary-600 mx-auto mb-4" />
            <div className="text-2xl font-bold text-gray-900">
              {new Date().getFullYear()}
            </div>
            <div className="text-gray-600">Since</div>
          </div>
        </div>

        {/* Add Review Button */}
        <div className="text-center mb-12">
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Share Your Experience</h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Role/Business *
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., Small Business Owner, Event Planner"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating *
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className={`p-1 rounded transition-colors duration-200 ${
                        star <= formData.rating
                          ? 'text-yellow-400 hover:text-yellow-500'
                          : 'text-gray-300 hover:text-gray-400'
                      }`}
                    >
                      <Star className={`h-6 w-6 ${star <= formData.rating ? 'fill-current' : ''}`} />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    ({formData.rating} star{formData.rating !== 1 ? 's' : ''})
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={4}
                  className="form-input"
                  placeholder="Share your experience with StickOn..."
                  required
                  minLength={10}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 10 characters ({formData.content.length}/10)
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
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

              <p className="text-gray-700 italic mb-4">"{review.content}"</p>

              {/* New badge for recent reviews */}
              {new Date() - new Date(review.createdAt) < 7 * 24 * 60 * 60 * 1000 && (
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  New
                </span>
              )}
            </div>
          ))}
        </div>

        {allReviews.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
            <p className="text-gray-600">Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerReviews