import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import jsPDF from 'jspdf'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Zap, 
  Download, 
  ShoppingCart, 
  Sparkles,
  RefreshCw,
  Wand2,
  Palette,
  Settings,
  Lightbulb,
  Target,
  Shuffle,
  Eye,
  Edit3,
  Sliders,
  ImageIcon,
  Type,
  Circle,
  Square,
  Star,
  Heart,
  Hexagon
} from 'lucide-react'

const AIDesigner = () => {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedLabel, setGeneratedLabel] = useState(null)
  const [showDownloadOptions, setShowDownloadOptions] = useState(false)
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [generationHistory, setGenerationHistory] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStyle, setSelectedStyle] = useState('auto')
  const [selectedColors, setSelectedColors] = useState('auto')
  
  const { user } = useAuth()
  const navigate = useNavigate()

  // Advanced AI Design Engine with comprehensive pattern matching
  const designPatterns = {
    // Business & Corporate
    business: {
      keywords: ['business', 'corporate', 'company', 'brand', 'professional', 'office', 'enterprise', 'corporate'],
      styles: ['modern', 'minimalist', 'corporate', 'clean'],
      colors: [
        { bg: '#F8FAFC', text: '#1E293B', accent: '#3B82F6' },
        { bg: '#F9FAFB', text: '#111827', accent: '#059669' },
        { bg: '#FAFAFA', text: '#212121', accent: '#6366F1' }
      ],
      fonts: ['Arial', 'Helvetica', 'Roboto'],
      layouts: ['centered', 'left-aligned', 'logo-top']
    },
    
    // Food & Beverage
    food: {
      keywords: ['food', 'restaurant', 'cafe', 'kitchen', 'recipe', 'organic', 'fresh', 'homemade', 'bakery', 'jam', 'sauce', 'beverage', 'drink', 'wine', 'beer', 'juice'],
      styles: ['rustic', 'organic', 'vintage', 'artisanal'],
      colors: [
        { bg: '#FDF2E9', text: '#7C2D12', accent: '#EA580C' },
        { bg: '#F0FDF4', text: '#14532D', accent: '#16A34A' },
        { bg: '#FEF3C7', text: '#92400E', accent: '#D97706' }
      ],
      fonts: ['Georgia', 'Times New Roman', 'serif'],
      layouts: ['circular', 'banner', 'vintage-frame']
    },

    // Wedding & Events
    wedding: {
      keywords: ['wedding', 'marriage', 'bride', 'groom', 'anniversary', 'celebration', 'love', 'romantic', 'elegant', 'favor'],
      styles: ['elegant', 'romantic', 'classic', 'luxury'],
      colors: [
        { bg: '#FDF2F8', text: '#BE185D', accent: '#EC4899' },
        { bg: '#F9F7FF', text: '#6B21A8', accent: '#A855F7' },
        { bg: '#FFFBEB', text: '#92400E', accent: '#F59E0B' }
      ],
      fonts: ['Times New Roman', 'Georgia', 'serif'],
      layouts: ['ornate', 'centered', 'script-style']
    },

    // Health & Beauty
    health: {
      keywords: ['health', 'beauty', 'spa', 'wellness', 'natural', 'skincare', 'cosmetic', 'fitness', 'medical', 'pharmacy'],
      styles: ['clean', 'natural', 'minimalist', 'spa'],
      colors: [
        { bg: '#F0F9FF', text: '#0C4A6E', accent: '#0284C7' },
        { bg: '#F0FDF4', text: '#14532D', accent: '#22C55E' },
        { bg: '#FEFCE8', text: '#365314', accent: '#84CC16' }
      ],
      fonts: ['Arial', 'Helvetica', 'Calibri'],
      layouts: ['clean', 'medical', 'spa-style']
    },

    // Fashion & Retail
    fashion: {
      keywords: ['fashion', 'clothing', 'style', 'trendy', 'boutique', 'designer', 'luxury', 'retail', 'apparel'],
      styles: ['trendy', 'luxury', 'minimalist', 'bold'],
      colors: [
        { bg: '#000000', text: '#FFFFFF', accent: '#F59E0B' },
        { bg: '#FFFFFF', text: '#000000', accent: '#EF4444' },
        { bg: '#1F2937', text: '#F9FAFB', accent: '#8B5CF6' }
      ],
      fonts: ['Helvetica', 'Arial', 'Impact'],
      layouts: ['fashion', 'luxury', 'bold-text']
    },

    // Technology
    tech: {
      keywords: ['tech', 'technology', 'software', 'digital', 'innovation', 'startup', 'app', 'cyber', 'data'],
      styles: ['futuristic', 'modern', 'tech', 'digital'],
      colors: [
        { bg: '#0F172A', text: '#F1F5F9', accent: '#06B6D4' },
        { bg: '#111827', text: '#F9FAFB', accent: '#10B981' },
        { bg: '#1E1B4B', text: '#E0E7FF', accent: '#8B5CF6' }
      ],
      fonts: ['Arial', 'Roboto', 'Consolas'],
      layouts: ['tech', 'grid', 'modern']
    },

    // Kids & Family
    kids: {
      keywords: ['kids', 'children', 'baby', 'family', 'fun', 'playful', 'colorful', 'toy', 'school'],
      styles: ['playful', 'colorful', 'fun', 'cartoon'],
      colors: [
        { bg: '#FEF3C7', text: '#92400E', accent: '#F59E0B' },
        { bg: '#DBEAFE', text: '#1E40AF', accent: '#3B82F6' },
        { bg: '#FCE7F3', text: '#BE185D', accent: '#EC4899' }
      ],
      fonts: ['Comic Sans MS', 'Arial', 'Verdana'],
      layouts: ['playful', 'rounded', 'bright']
    },

    // Nature & Eco
    nature: {
      keywords: ['nature', 'eco', 'green', 'organic', 'sustainable', 'environment', 'natural', 'earth', 'plant'],
      styles: ['organic', 'natural', 'eco', 'earthy'],
      colors: [
        { bg: '#F0FDF4', text: '#14532D', accent: '#22C55E' },
        { bg: '#FEF3E2', text: '#92400E', accent: '#EA580C' },
        { bg: '#E0F2FE', text: '#164E63', accent: '#0891B2' }
      ],
      fonts: ['Georgia', 'Times New Roman', 'Arial'],
      layouts: ['organic', 'natural', 'earth-tone']
    }
  }

  // AI Intelligence Engine
  const analyzePrompt = (userPrompt) => {
    const prompt = userPrompt.toLowerCase()
    let matchedCategories = []
    let confidence = 0
    
    // Find matching categories
    Object.entries(designPatterns).forEach(([category, pattern]) => {
      const matches = pattern.keywords.filter(keyword => prompt.includes(keyword))
      if (matches.length > 0) {
        matchedCategories.push({
          category,
          matches,
          confidence: matches.length / pattern.keywords.length
        })
      }
    })
    
    // Sort by confidence
    matchedCategories.sort((a, b) => b.confidence - a.confidence)
    
    return matchedCategories.length > 0 ? matchedCategories[0] : null
  }

  // Advanced text extraction and styling
  const extractTextFromPrompt = (prompt) => {
    // Common patterns for extracting actual label text
    const textPatterns = [
      /label.*?["']([^"']+)["']/i,
      /text.*?["']([^"']+)["']/i,
      /says?.*?["']([^"']+)["']/i,
      /called.*?["']([^"']+)["']/i,
      /named.*?["']([^"']+)["']/i,
      /"([^"]+)"/,
      /'([^']+)'/
    ]

    for (const pattern of textPatterns) {
      const match = prompt.match(pattern)
      if (match) return match[1]
    }

    // Fallback: extract key nouns and create label text
    const words = prompt.toLowerCase().split(/\s+/)
    const importantWords = words.filter(word => 
      word.length > 3 && 
      !['label', 'design', 'create', 'make', 'with', 'that', 'have', 'for'].includes(word)
    )

    if (importantWords.length > 0) {
      return importantWords.slice(0, 3).map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join('\n')
    }

    return 'Custom Label'
  }

  // Intelligent size determination
  const determineLabelSize = (prompt, category) => {
    const prompt_lower = prompt.toLowerCase()
    
    if (prompt_lower.includes('wine') || prompt_lower.includes('bottle')) {
      return { width: 250, height: 350 }
    } else if (prompt_lower.includes('jar') || prompt_lower.includes('circle')) {
      return { width: 180, height: 180 }
    } else if (prompt_lower.includes('business card') || prompt_lower.includes('card')) {
      return { width: 350, height: 200 }
    } else if (prompt_lower.includes('sticker') || prompt_lower.includes('small')) {
      return { width: 150, height: 150 }
    } else if (prompt_lower.includes('banner') || prompt_lower.includes('long')) {
      return { width: 400, height: 150 }
    }
    
    // Default sizes based on category
    const categorySizes = {
      business: { width: 300, height: 200 },
      wedding: { width: 250, height: 200 },
      food: { width: 200, height: 250 },
      default: { width: 300, height: 200 }
    }
    
    return categorySizes[category?.category] || categorySizes.default
  }

  // Advanced label generation
  const generateAdvancedLabel = async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    
    // Simulate AI processing with realistic delay
    setTimeout(() => {
      try {
        // Analyze the prompt
        const analysis = analyzePrompt(prompt)
        const category = analysis?.category || 'business'
        const pattern = designPatterns[category]
        
        // Extract meaningful text
        const labelText = extractTextFromPrompt(prompt)
        
        // Determine appropriate size
        const dimensions = determineLabelSize(prompt, analysis)
        
        // Select style and colors intelligently
        const selectedColorScheme = pattern.colors[Math.floor(Math.random() * pattern.colors.length)]
        const selectedFont = pattern.fonts[Math.floor(Math.random() * pattern.fonts.length)]
        const selectedStyleFromPattern = pattern.styles[Math.floor(Math.random() * pattern.styles.length)]
        
        // Determine shape
        let shape = 'rectangle'
        if (prompt.toLowerCase().includes('circle') || prompt.toLowerCase().includes('round') || 
            prompt.toLowerCase().includes('jar') || category === 'food' && Math.random() > 0.7) {
          shape = 'circle'
        }
        
        // Calculate font size based on text length and label size
        const textLength = labelText.length
        let fontSize = Math.max(14, Math.min(32, Math.floor(dimensions.width / (textLength * 0.6))))
        
        // Generate the label
        const generatedDesign = {
          id: Date.now(),
          text: labelText,
          fontSize: fontSize,
          fontFamily: selectedFont,
          fontColor: selectedColorScheme.text,
          backgroundColor: selectedColorScheme.bg,
          accentColor: selectedColorScheme.accent,
          width: dimensions.width,
          height: dimensions.height,
          shape: shape,
          style: selectedStyleFromPattern,
          category: category,
          confidence: analysis?.confidence || 0.5,
          prompt: prompt,
          timestamp: new Date().toISOString()
        }
        
        setGeneratedLabel(generatedDesign)
        
        // Add to history
        setGenerationHistory(prev => [generatedDesign, ...prev.slice(0, 9)])
        
        setIsGenerating(false)
      } catch (error) {
        console.error('Generation error:', error)
        setIsGenerating(false)
        alert('Error generating label. Please try again.')
      }
    }, 2000 + Math.random() * 1000) // Variable delay for realism
  }

  // Enhanced download with better canvas rendering
  const downloadLabel = (format) => {
    if (!generatedLabel) return
    
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const scale = 2 // High DPI
    
    canvas.width = generatedLabel.width * scale
    canvas.height = generatedLabel.height * scale
    ctx.scale(scale, scale)
    
    // Anti-aliasing
    ctx.textRenderingOptimization = 'optimizeQuality'
    ctx.imageSmoothingEnabled = true
    
    // Draw background
    ctx.fillStyle = generatedLabel.backgroundColor
    if (generatedLabel.shape === 'circle') {
      ctx.beginPath()
      ctx.arc(generatedLabel.width/2, generatedLabel.height/2, 
              Math.min(generatedLabel.width, generatedLabel.height)/2, 0, 2 * Math.PI)
      ctx.fill()
    } else {
      ctx.fillRect(0, 0, generatedLabel.width, generatedLabel.height)
    }
    
    // Draw accent elements based on style
    if (generatedLabel.category === 'wedding') {
      // Add decorative border
      ctx.strokeStyle = generatedLabel.accentColor
      ctx.lineWidth = 3
      ctx.strokeRect(10, 10, generatedLabel.width - 20, generatedLabel.height - 20)
    } else if (generatedLabel.category === 'tech') {
      // Add tech-style grid pattern
      ctx.strokeStyle = generatedLabel.accentColor + '20'
      ctx.lineWidth = 1
      for (let i = 0; i < generatedLabel.width; i += 20) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, generatedLabel.height)
        ctx.stroke()
      }
    }
    
    // Draw text with enhanced styling
    ctx.fillStyle = generatedLabel.fontColor
    ctx.font = `${generatedLabel.fontSize}px ${generatedLabel.fontFamily}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    const lines = generatedLabel.text.split('\n')
    const lineHeight = generatedLabel.fontSize * 1.3
    const startY = generatedLabel.height/2 - (lines.length - 1) * lineHeight / 2
    
    lines.forEach((line, index) => {
      const y = startY + index * lineHeight
      
      // Add text shadow for certain styles
      if (generatedLabel.style === 'luxury' || generatedLabel.category === 'fashion') {
        ctx.fillStyle = 'rgba(0,0,0,0.3)'
        ctx.fillText(line, generatedLabel.width/2 + 2, y + 2)
        ctx.fillStyle = generatedLabel.fontColor
      }
      
      ctx.fillText(line, generatedLabel.width/2, y)
    })
    
    // Download logic
    const link = document.createElement('a')
    if (format === 'png' || format === 'jpg') {
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg'
      link.download = `ai-label-${Date.now()}.${format}`
      link.href = canvas.toDataURL(mimeType, 0.95)
    } else if (format === 'pdf') {
      try {
        const pdf = new jsPDF({
          orientation: generatedLabel.width > generatedLabel.height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [generatedLabel.width + 40, generatedLabel.height + 40]
        })
        
        const imageData = canvas.toDataURL('image/png')
        pdf.addImage(imageData, 'PNG', 20, 20, generatedLabel.width, generatedLabel.height)
        pdf.save(`ai-label-${Date.now()}.pdf`)
        setShowDownloadOptions(false)
        return
      } catch (error) {
        console.error('PDF error:', error)
        alert('Error generating PDF. Please try again.')
        setShowDownloadOptions(false)
        return
      }
    }
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setShowDownloadOptions(false)
  }

  // Intelligent prompt suggestions
  const promptSuggestions = [
    {
      category: 'Business',
      prompts: [
        'Professional corporate logo label with "TechCorp Solutions" in blue and gray',
        'Minimalist business card label for "Creative Agency" with modern typography',
        'Clean office product label saying "Premium Quality" in corporate colors'
      ]
    },
    {
      category: 'Food & Beverage',
      prompts: [
        'Vintage wine bottle label for "Heritage Vineyard 2023" with elegant script',
        'Organic jam jar label saying "Grandma\'s Strawberry Jam" in rustic style',
        'Craft beer bottle label for "Mountain Brew IPA" with bold design'
      ]
    },
    {
      category: 'Wedding',
      prompts: [
        'Elegant wedding favor label with "Sarah & Michael" and wedding date',
        'Romantic save-the-date label saying "Together Forever" with gold accents',
        'Classic wedding wine label for "Celebration 2024" in script font'
      ]
    },
    {
      category: 'Health & Beauty',
      prompts: [
        'Natural skincare product label for "Pure Essence Cream" in spa colors',
        'Medical prescription label with clean, professional design',
        'Wellness supplement label saying "Daily Vitamins" with healthy colors'
      ]
    }
  ]

  const renderPreview = () => {
    if (!generatedLabel) return null
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center p-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-6 relative overflow-hidden"
      >
        {/* Background pattern based on category */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: generatedLabel.category === 'tech' 
              ? 'linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%)'
              : generatedLabel.category === 'wedding'
              ? 'radial-gradient(circle, #000 1px, transparent 1px)'
              : 'none',
            backgroundSize: generatedLabel.category === 'tech' ? '20px 20px' : '30px 30px'
          }}
        />
        
        <div 
          className="relative shadow-lg"
          style={{
            width: `${Math.min(generatedLabel.width, 400)}px`,
            height: `${Math.min(generatedLabel.height, 300)}px`,
            backgroundColor: generatedLabel.backgroundColor,
            borderRadius: generatedLabel.shape === 'circle' ? '50%' : '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: generatedLabel.fontColor,
            fontSize: `${Math.min(generatedLabel.fontSize, 24)}px`,
            fontFamily: generatedLabel.fontFamily,
            textAlign: 'center',
            padding: '20px',
            wordWrap: 'break-word',
            lineHeight: '1.3',
            whiteSpace: 'pre-line',
            border: generatedLabel.category === 'wedding' ? `3px solid ${generatedLabel.accentColor}` : 'none',
            boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }}
        >
          {generatedLabel.text}
          
          {/* Category-specific decorative elements */}
          {generatedLabel.category === 'luxury' && (
            <div className="absolute top-2 right-2">
              <Star className="w-4 h-4" style={{ color: generatedLabel.accentColor }} />
            </div>
          )}
        </div>
        
        {/* Confidence indicator */}
        <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs">
          <span className="text-green-600 font-medium">
            {Math.round(generatedLabel.confidence * 100)}% Match
          </span>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
                <Sparkles className="h-8 w-8 text-blue-600" />
                <span>AI Label Designer</span>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-lg">Pro</span>
              </h1>
              <p className="text-gray-600">Intelligent design generation powered by advanced AI</p>
            </div>
          </div>
          
          {generatedLabel && (
            <div className="flex items-center space-x-3">
              <div className="relative">
                <button
                  onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
                
                {showDownloadOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                  >
                    {['png', 'jpg', 'pdf'].map(format => (
                      <button
                        key={format}
                        onClick={() => downloadLabel(format)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Export as {format.toUpperCase()}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
              
              <Link
                to="/create-label"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit in Pro Editor</span>
              </Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Main Prompt */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Describe Your Vision</h2>
                  <p className="text-gray-600 text-sm">Tell our AI exactly what you want</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Label Description *
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows="4"
                  placeholder="Example: Create an elegant wine bottle label for 'Heritage Vineyard 2023' with gold accents and classic typography on a cream background"
                />
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                  <span>Be specific for better results</span>
                  <span>{prompt.length}/500</span>
                </div>
              </div>

              <button
                onClick={generateAdvancedLabel}
                disabled={!prompt.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>AI is Designing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5" />
                    <span>Generate Design</span>
                  </>
                )}
              </button>
            </motion.div>

            {/* Quick Categories */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span>Quick Start</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                {Object.keys(designPatterns).map(category => (
                  <button
                    key={category}
                    onClick={() => setPrompt(`Create a ${category} label with professional design`)}
                    className="p-3 text-sm bg-gray-50 hover:bg-blue-50 border hover:border-blue-200 rounded-lg transition-colors capitalize"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Prompt Examples */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Wand2 className="h-5 w-5 text-purple-600" />
                <span>Inspiration</span>
              </h3>
              
              <div className="space-y-3">
                {promptSuggestions.slice(0, 2).map((category, idx) => (
                  <div key={idx}>
                    <p className="text-sm font-medium text-gray-700 mb-2">{category.category}</p>
                    {category.prompts.slice(0, 2).map((example, i) => (
                      <button
                        key={i}
                        onClick={() => setPrompt(example)}
                        className="w-full text-left p-2 text-xs bg-gray-50 hover:bg-purple-50 rounded border hover:border-purple-200 transition-colors mb-2"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 h-fit"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center space-x-2">
                  <Palette className="h-5 w-5 text-blue-600" />
                  <span>AI Generated Design</span>
                </h3>
                
                {generatedLabel && (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setGeneratedLabel(null)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Clear design"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                    <button
                      onClick={generateAdvancedLabel}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Regenerate"
                    >
                      <Shuffle className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <AnimatePresence mode="wait">
                {!generatedLabel && !isGenerating && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-16"
                  >
                    <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="h-12 w-12 text-blue-600" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Ready to Create Magic</h4>
                    <p className="text-gray-600 mb-4">Describe your perfect label and watch AI bring it to life</p>
                    <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>Live Preview</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Zap className="h-4 w-4" />
                        <span>AI Powered</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="h-4 w-4" />
                        <span>HD Export</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {isGenerating && (
                  <motion.div
                    key="generating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-16"
                  >
                    <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                      <RefreshCw className="h-12 w-12 text-blue-600 animate-spin" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">AI is Creating Your Design</h4>
                    <p className="text-gray-600 mb-6">Analyzing your description and generating the perfect label...</p>
                    <div className="w-64 mx-auto bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }} />
                    </div>
                  </motion.div>
                )}
                
                {generatedLabel && (
                  <motion.div
                    key="generated"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    {renderPreview()}
                    
                    {/* Design Details */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Category:</span>
                          <p className="font-medium capitalize">{generatedLabel.category}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Style:</span>
                          <p className="font-medium capitalize">{generatedLabel.style}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Size:</span>
                          <p className="font-medium">{generatedLabel.width} × {generatedLabel.height}px</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Shape:</span>
                          <p className="font-medium capitalize">{generatedLabel.shape}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={generateAdvancedLabel}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>Generate Variation</span>
                      </button>
                      <Link
                        to="/create-label"
                        state={{ aiGenerated: generatedLabel }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
                      >
                        <Edit3 className="h-4 w-4" />
                        <span>Edit in Advanced Editor</span>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Generation History */}
        {generationHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <RefreshCw className="h-5 w-5 text-gray-600" />
              <span>Recent Designs</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {generationHistory.map((design) => (
                <motion.button
                  key={design.id}
                  onClick={() => setGeneratedLabel(design)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="aspect-square bg-gray-100 rounded-lg p-4 hover:shadow-md transition-all"
                >
                  <div
                    className="w-full h-full rounded flex items-center justify-center text-xs font-medium"
                    style={{
                      backgroundColor: design.backgroundColor,
                      color: design.fontColor,
                      borderRadius: design.shape === 'circle' ? '50%' : '8px'
                    }}
                  >
                    {design.text.substring(0, 20)}...
                  </div>
                  <p className="mt-2 text-xs text-gray-500 truncate capitalize">
                    {design.category} • {design.style}
                  </p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* AI Capabilities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Powered by Advanced AI</h3>
            <p className="text-blue-100">Our intelligent design system understands context, style, and purpose</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white bg-opacity-20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-6 w-6" />
              </div>
              <h4 className="font-semibold mb-2">Smart Analysis</h4>
              <p className="text-blue-100 text-sm">Understands your description and selects appropriate styles, colors, and layouts</p>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="h-6 w-6" />
              </div>
              <h4 className="font-semibold mb-2">Design Intelligence</h4>
              <p className="text-blue-100 text-sm">Automatically chooses colors, fonts, and proportions based on industry standards</p>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6" />
              </div>
              <h4 className="font-semibold mb-2">Purpose Driven</h4>
              <p className="text-blue-100 text-sm">Optimizes designs for specific use cases and target audiences</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AIDesigner