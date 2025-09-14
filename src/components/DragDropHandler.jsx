import React, { useState, useCallback } from 'react'
import { Upload, Image as ImageIcon, X } from 'lucide-react'

const DragDropHandler = ({ onImageDrop, children }) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [showDropZone, setShowDropZone] = useState(false)

  const handleDragEnter = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      const hasImageFile = Array.from(e.dataTransfer.items).some(
        item => item.kind === 'file' && item.type.startsWith('image/')
      )
      if (hasImageFile) {
        setIsDragOver(true)
        setShowDropZone(true)
      }
    }
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Only hide drop zone if leaving the main container
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false)
      setShowDropZone(false)
    }
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsDragOver(false)
    setShowDropZone(false)
    
    const files = Array.from(e.dataTransfer.files)
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length > 0 && onImageDrop) {
      imageFiles.forEach(file => onImageDrop(file))
    }
  }, [onImageDrop])

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="relative w-full h-full"
    >
      {children}
      
      {/* Drop zone overlay */}
      {showDropZone && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className={`max-w-md w-full mx-4 p-8 bg-white rounded-lg shadow-xl border-4 border-dashed transition-colors ${
            isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}>
            <div className="text-center">
              <div className="mb-4">
                <ImageIcon className={`w-16 h-16 mx-auto ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Drop Images Here
              </h3>
              <p className="text-gray-600 mb-4">
                Release to add images to your label
              </p>
              <div className="text-sm text-gray-500">
                Supports: JPG, PNG, GIF, SVG
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DragDropHandler