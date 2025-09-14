import React, { createContext, useContext, useState, useEffect } from 'react'

const ReviewContext = createContext()

export const useReviews = () => {
  const context = useContext(ReviewContext)
  if (!context) {
    throw new Error('useReviews must be used within a ReviewProvider')
  }
  return context
}

const initialReviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Small Business Owner",
    content: "StickOn helped me create professional labels for my homemade products. The quality is amazing!",
    rating: 5,
    createdAt: "2024-01-15T10:30:00Z",
    avatar: "https://picsum.photos/60/60?random=10"
  },
  {
    id: 2,
    name: "Mike Chen",
    role: "Event Planner",
    content: "The AI designer saved me hours of work. Perfect labels for all my events with just a few clicks.",
    rating: 5,
    createdAt: "2024-01-20T14:20:00Z",
    avatar: "https://picsum.photos/60/60?random=11"
  },
  {
    id: 3,
    name: "Lisa Davis",
    role: "Home Organizer",
    content: "Love how easy it is to create custom labels for organizing my home. Great variety of templates!",
    rating: 5,
    createdAt: "2024-01-25T09:45:00Z",
    avatar: "https://picsum.photos/60/60?random=12"
  },
  {
    id: 4,
    name: "David Kumar",
    role: "Restaurant Owner",
    content: "Professional quality labels for our food packaging. Customers love the clean design!",
    rating: 4,
    createdAt: "2024-02-01T16:10:00Z",
    avatar: "https://picsum.photos/60/60?random=13"
  },
  {
    id: 5,
    name: "Emma Wilson",
    role: "Craft Store Owner",
    content: "The variety of designs and easy customization makes this perfect for my business needs.",
    rating: 5,
    createdAt: "2024-02-05T11:15:00Z",
    avatar: "https://picsum.photos/60/60?random=14"
  },
  {
    id: 6,
    name: "James Rodriguez",
    role: "Product Designer",
    content: "Impressed by the print quality and fast delivery. Will definitely use again for future projects.",
    rating: 4,
    createdAt: "2024-02-10T13:30:00Z",
    avatar: "https://picsum.photos/60/60?random=15"
  },
  {
    id: 7,
    name: "Priya Sharma",
    role: "Wedding Planner",
    content: "Beautiful wedding labels that perfectly matched our theme. Guests were impressed!",
    rating: 5,
    createdAt: "2024-02-15T10:00:00Z",
    avatar: "https://picsum.photos/60/60?random=16"
  },
  {
    id: 8,
    name: "Tom Anderson",
    role: "Brewery Owner",
    content: "High-quality waterproof labels for our beer bottles. Exactly what we needed!",
    rating: 5,
    createdAt: "2024-02-20T15:45:00Z",
    avatar: "https://picsum.photos/60/60?random=17"
  }
]

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState(() => {
    // Load reviews from localStorage or use initial reviews
    const savedReviews = localStorage.getItem('stickon_reviews')
    if (savedReviews) {
      try {
        return JSON.parse(savedReviews)
      } catch (error) {
        console.error('Error loading reviews:', error)
        return initialReviews
      }
    }
    return initialReviews
  })

  // Save reviews to localStorage whenever reviews change
  useEffect(() => {
    localStorage.setItem('stickon_reviews', JSON.stringify(reviews))
  }, [reviews])

  const addReview = (reviewData) => {
    const newReview = {
      id: Date.now(), // Simple ID generation
      ...reviewData,
      createdAt: new Date().toISOString(),
      avatar: `https://picsum.photos/60/60?random=${Math.floor(Math.random() * 100) + 20}`
    }

    setReviews(prevReviews => [newReview, ...prevReviews])
    return newReview
  }

  const getRecentReviews = (count = 3) => {
    return reviews
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, count)
  }

  const getAllReviews = () => {
    return reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  const getAverageRating = () => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    return (sum / reviews.length).toFixed(1)
  }

  const getTotalReviews = () => {
    return reviews.length
  }

  const value = {
    reviews,
    addReview,
    getRecentReviews,
    getAllReviews,
    getAverageRating,
    getTotalReviews
  }

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  )
}

export default ReviewContext