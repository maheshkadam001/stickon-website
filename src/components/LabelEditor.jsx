import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Type, Image as ImageIcon, Palette, Square, Circle, Upload, 
  RotateCw, FlipHorizontal, FlipVertical, Copy, Trash2, 
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline,
  Layers, Eye, EyeOff, Move, ZoomIn, ZoomOut, Grid, Ruler,
  Undo, Redo, Save, Download, Settings, Plus, Minus
} from 'lucide-react'

const LabelEditor = React.forwardRef(({ initialSettings = {}, onSettingsChange }, ref) => {
  // Editor state
  const [labelDimensions, setLabelDimensions] = useState({ 
    width: initialSettings.width || 400, 
    height: initialSettings.height || 200 
  })
  const [zoom, setZoom] = useState(1)
  const [showGrid, setShowGrid] = useState(true)
  const [selectedElement, setSelectedElement] = useState(null)
  const [elements, setElements] = useState([])
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  
  // Tool states
  const [activeTool, setActiveTool] = useState('select')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showLayersPanel, setShowLayersPanel] = useState(true)
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(true)
  
  // Canvas ref
  const canvasRef = useRef(null)
  const editorRef = useRef(null)
  
  // Drag state
  const [dragState, setDragState] = useState({
    isDragging: false,
    dragType: 'move', // 'move', 'resize'
    startPos: { x: 0, y: 0 },
    elementIndex: -1
  })

  // Add element to history
  const addToHistory = useCallback((newElements) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(JSON.parse(JSON.stringify(newElements)))
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [history, historyIndex])

  // Undo/Redo functions
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setElements(JSON.parse(JSON.stringify(history[historyIndex - 1])))
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setElements(JSON.parse(JSON.stringify(history[historyIndex + 1])))
    }
  }

  // Add text element
  const addTextElement = () => {
    const newElement = {
      id: Date.now(),
      type: 'text',
      content: 'New Text',
      x: 50,
      y: 50,
      width: 120,
      height: 30,
      fontSize: 16,
      fontFamily: 'Arial',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      color: '#000000',
      textAlign: 'left',
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: elements.length
    }
    const newElements = [...elements, newElement]
    setElements(newElements)
    addToHistory(newElements)
    setSelectedElement(newElement.id)
  }

  // Add shape element
  const addShapeElement = (shapeType) => {
    const newElement = {
      id: Date.now(),
      type: 'shape',
      shapeType,
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      fill: '#3b82f6',
      stroke: '#1e40af',
      strokeWidth: 2,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: elements.length
    }
    const newElements = [...elements, newElement]
    setElements(newElements)
    addToHistory(newElements)
    setSelectedElement(newElement.id)
  }

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const newElement = {
            id: Date.now(),
            type: 'image',
            src: e.target.result,
            x: 50,
            y: 50,
            width: Math.min(img.width, 150),
            height: Math.min(img.height, 150),
            originalWidth: img.width,
            originalHeight: img.height,
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
            zIndex: elements.length
          }
          const newElements = [...elements, newElement]
          setElements(newElements)
          addToHistory(newElements)
          setSelectedElement(newElement.id)
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }

  // Update element
  const updateElement = (elementId, updates) => {
    const newElements = elements.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    )
    setElements(newElements)
    addToHistory(newElements)
  }

  // Delete element
  const deleteElement = (elementId) => {
    const newElements = elements.filter(el => el.id !== elementId)
    setElements(newElements)
    addToHistory(newElements)
    setSelectedElement(null)
  }

  // Duplicate element
  const duplicateElement = (elementId) => {
    const element = elements.find(el => el.id === elementId)
    if (element) {
      const newElement = {
        ...element,
        id: Date.now(),
        x: element.x + 20,
        y: element.y + 20,
        zIndex: elements.length
      }
      const newElements = [...elements, newElement]
      setElements(newElements)
      addToHistory(newElements)
      setSelectedElement(newElement.id)
    }
  }

  // Toggle element visibility
  const toggleElementVisibility = (elementId) => {
    updateElement(elementId, { visible: !elements.find(el => el.id === elementId)?.visible })
  }

  // Move element in layers
  const moveElementLayer = (elementId, direction) => {
    const element = elements.find(el => el.id === elementId)
    if (!element) return

    const newZIndex = direction === 'up' 
      ? Math.min(element.zIndex + 1, elements.length - 1)
      : Math.max(element.zIndex - 1, 0)
    
    updateElement(elementId, { zIndex: newZIndex })
  }

  // Color picker component
  const ColorPicker = ({ color, onChange, showAlpha = false }) => {
    const presetColors = [
      '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
      '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080',
      '#ffc0cb', '#a52a2a', '#808080', '#000080', '#008000'
    ]

    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border">
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-8 rounded border cursor-pointer"
        />
        <div className="grid grid-cols-5 gap-2 mt-3">
          {presetColors.map((presetColor) => (
            <button
              key={presetColor}
              className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-400"
              style={{ backgroundColor: presetColor }}
              onClick={() => onChange(presetColor)}
            />
          ))}
        </div>
      </div>
    )
  }

  // Render canvas elements
  const renderElements = () => {
    return elements
      .sort((a, b) => a.zIndex - b.zIndex)
      .map((element) => {
        const isSelected = selectedElement === element.id
        const transform = `translate(${element.x}px, ${element.y}px) rotate(${element.rotation}deg)`
        
        let content = null
        
        if (element.type === 'text') {
          content = (
            <div
              style={{
                fontSize: element.fontSize,
                fontFamily: element.fontFamily,
                fontWeight: element.fontWeight,
                fontStyle: element.fontStyle,
                textDecoration: element.textDecoration,
                color: element.color,
                textAlign: element.textAlign,
                width: element.width,
                height: element.height,
                opacity: element.opacity,
                cursor: 'move',
                userSelect: 'none',
                whiteSpace: 'pre-wrap',
                overflow: 'hidden'
              }}
            >
              {element.content}
            </div>
          )
        } else if (element.type === 'shape') {
          if (element.shapeType === 'rectangle') {
            content = (
              <div
                style={{
                  width: element.width,
                  height: element.height,
                  backgroundColor: element.fill,
                  border: `${element.strokeWidth}px solid ${element.stroke}`,
                  opacity: element.opacity,
                  cursor: 'move'
                }}
              />
            )
          } else if (element.shapeType === 'circle') {
            content = (
              <div
                style={{
                  width: element.width,
                  height: element.height,
                  backgroundColor: element.fill,
                  border: `${element.strokeWidth}px solid ${element.stroke}`,
                  borderRadius: '50%',
                  opacity: element.opacity,
                  cursor: 'move'
                }}
              />
            )
          }
        } else if (element.type === 'image') {
          content = (
            <img
              src={element.src}
              alt="Label element"
              style={{
                width: element.width,
                height: element.height,
                opacity: element.opacity,
                cursor: 'move',
                objectFit: 'cover'
              }}
              draggable={false}
            />
          )
        }

        if (!element.visible) return null

        return (
          <div
            key={element.id}
            className={`absolute ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
            style={{
              transform,
              transformOrigin: 'top left'
            }}
            onClick={() => setSelectedElement(element.id)}
          >
            {content}
            {isSelected && (
              <div className="absolute -top-1 -left-1 -right-1 -bottom-1 border-2 border-blue-500 pointer-events-none">
                {/* Resize handles */}
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 cursor-nw-resize" />
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 cursor-n-resize" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 cursor-ne-resize" />
                <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-blue-500 cursor-e-resize" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 cursor-se-resize" />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 cursor-s-resize" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 cursor-sw-resize" />
                <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-2 bg-blue-500 cursor-w-resize" />
              </div>
            )}
          </div>
        )
      })
  }

  // Properties panel
  const PropertiesPanel = () => {
    const element = elements.find(el => el.id === selectedElement)
    if (!element) {
      return (
        <div className="p-4 text-center text-gray-500">
          <Settings className="w-8 h-8 mx-auto mb-2" />
          <p>Select an element to edit properties</p>
        </div>
      )
    }

    return (
      <div className="p-4 space-y-4">
        <h3 className="font-semibold text-gray-900 mb-4">Properties</h3>
        
        {/* Position & Size */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Position & Size</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">X</label>
              <input
                type="number"
                value={Math.round(element.x)}
                onChange={(e) => updateElement(element.id, { x: parseFloat(e.target.value) })}
                className="w-full px-2 py-1 border rounded text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Y</label>
              <input
                type="number"
                value={Math.round(element.y)}
                onChange={(e) => updateElement(element.id, { y: parseFloat(e.target.value) })}
                className="w-full px-2 py-1 border rounded text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Width</label>
              <input
                type="number"
                value={Math.round(element.width)}
                onChange={(e) => updateElement(element.id, { width: parseFloat(e.target.value) })}
                className="w-full px-2 py-1 border rounded text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Height</label>
              <input
                type="number"
                value={Math.round(element.height)}
                onChange={(e) => updateElement(element.id, { height: parseFloat(e.target.value) })}
                className="w-full px-2 py-1 border rounded text-sm"
              />
            </div>
          </div>
        </div>

        {/* Text Properties */}
        {element.type === 'text' && (
          <>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Text Content</h4>
              <textarea
                value={element.content}
                onChange={(e) => updateElement(element.id, { content: e.target.value })}
                className="w-full px-2 py-1 border rounded text-sm resize-none"
                rows="2"
              />
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Typography</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500">Font Size</label>
                  <input
                    type="number"
                    value={element.fontSize}
                    onChange={(e) => updateElement(element.id, { fontSize: parseInt(e.target.value) })}
                    className="w-full px-2 py-1 border rounded text-sm"
                    min="8"
                    max="72"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Font Family</label>
                  <select
                    value={element.fontFamily}
                    onChange={(e) => updateElement(element.id, { fontFamily: e.target.value })}
                    className="w-full px-2 py-1 border rounded text-sm"
                  >
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Verdana">Verdana</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => updateElement(element.id, { 
                    fontWeight: element.fontWeight === 'bold' ? 'normal' : 'bold' 
                  })}
                  className={`p-2 border rounded ${element.fontWeight === 'bold' ? 'bg-blue-100 border-blue-300' : ''}`}
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  onClick={() => updateElement(element.id, { 
                    fontStyle: element.fontStyle === 'italic' ? 'normal' : 'italic' 
                  })}
                  className={`p-2 border rounded ${element.fontStyle === 'italic' ? 'bg-blue-100 border-blue-300' : ''}`}
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => updateElement(element.id, { 
                    textDecoration: element.textDecoration === 'underline' ? 'none' : 'underline' 
                  })}
                  className={`p-2 border rounded ${element.textDecoration === 'underline' ? 'bg-blue-100 border-blue-300' : ''}`}
                >
                  <Underline className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => updateElement(element.id, { textAlign: 'left' })}
                  className={`p-2 border rounded ${element.textAlign === 'left' ? 'bg-blue-100 border-blue-300' : ''}`}
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => updateElement(element.id, { textAlign: 'center' })}
                  className={`p-2 border rounded ${element.textAlign === 'center' ? 'bg-blue-100 border-blue-300' : ''}`}
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => updateElement(element.id, { textAlign: 'right' })}
                  className={`p-2 border rounded ${element.textAlign === 'right' ? 'bg-blue-100 border-blue-300' : ''}`}
                >
                  <AlignRight className="w-4 h-4" />
                </button>
              </div>
              
              <div>
                <label className="text-xs text-gray-500">Text Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={element.color}
                    onChange={(e) => updateElement(element.id, { color: e.target.value })}
                    className="w-8 h-8 border rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">{element.color}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Shape Properties */}
        {element.type === 'shape' && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Shape Style</h4>
            <div>
              <label className="text-xs text-gray-500">Fill Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={element.fill}
                  onChange={(e) => updateElement(element.id, { fill: e.target.value })}
                  className="w-8 h-8 border rounded cursor-pointer"
                />
                <span className="text-sm text-gray-600">{element.fill}</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500">Stroke Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={element.stroke}
                  onChange={(e) => updateElement(element.id, { stroke: e.target.value })}
                  className="w-8 h-8 border rounded cursor-pointer"
                />
                <span className="text-sm text-gray-600">{element.stroke}</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500">Stroke Width</label>
              <input
                type="number"
                value={element.strokeWidth}
                onChange={(e) => updateElement(element.id, { strokeWidth: parseInt(e.target.value) })}
                className="w-full px-2 py-1 border rounded text-sm"
                min="0"
                max="20"
              />
            </div>
          </div>
        )}

        {/* Transform */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Transform</h4>
          <div>
            <label className="text-xs text-gray-500">Rotation (degrees)</label>
            <input
              type="range"
              min="-180"
              max="180"
              value={element.rotation}
              onChange={(e) => updateElement(element.id, { rotation: parseInt(e.target.value) })}
              className="w-full"
            />
            <span className="text-xs text-gray-600">{element.rotation}°</span>
          </div>
          <div>
            <label className="text-xs text-gray-500">Opacity</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={element.opacity}
              onChange={(e) => updateElement(element.id, { opacity: parseFloat(e.target.value) })}
              className="w-full"
            />
            <span className="text-xs text-gray-600">{Math.round(element.opacity * 100)}%</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => duplicateElement(element.id)}
              className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center justify-center space-x-1"
            >
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </button>
            <button
              onClick={() => deleteElement(element.id)}
              className="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 flex items-center justify-center space-x-1"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Expose methods to parent component
  React.useImperativeHandle(ref, () => ({
    getLabelData: () => ({
      elements,
      dimensions: labelDimensions,
      settings: {
        zoom,
        showGrid
      }
    }),
    getCanvas: () => {
      // Create a canvas with all elements rendered
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      canvas.width = labelDimensions.width
      canvas.height = labelDimensions.height
      
      // Draw white background
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Render all visible elements
      elements
        .filter(el => el.visible)
        .sort((a, b) => a.zIndex - b.zIndex)
        .forEach(element => {
          ctx.save()
          
          // Apply transformations
          ctx.translate(element.x + element.width/2, element.y + element.height/2)
          ctx.rotate((element.rotation * Math.PI) / 180)
          ctx.translate(-element.width/2, -element.height/2)
          ctx.globalAlpha = element.opacity
          
          if (element.type === 'text') {
            ctx.fillStyle = element.color
            ctx.font = `${element.fontWeight} ${element.fontStyle} ${element.fontSize}px ${element.fontFamily}`
            ctx.textAlign = element.textAlign
            ctx.textBaseline = 'top'
            
            const lines = element.content.split('\n')
            const lineHeight = element.fontSize * 1.2
            lines.forEach((line, index) => {
              ctx.fillText(line, 0, index * lineHeight)
            })
          } else if (element.type === 'shape') {
            ctx.fillStyle = element.fill
            ctx.strokeStyle = element.stroke
            ctx.lineWidth = element.strokeWidth
            
            if (element.shapeType === 'rectangle') {
              ctx.fillRect(0, 0, element.width, element.height)
              if (element.strokeWidth > 0) {
                ctx.strokeRect(0, 0, element.width, element.height)
              }
            } else if (element.shapeType === 'circle') {
              const radius = Math.min(element.width, element.height) / 2
              ctx.beginPath()
              ctx.arc(element.width/2, element.height/2, radius, 0, 2 * Math.PI)
              ctx.fill()
              if (element.strokeWidth > 0) {
                ctx.stroke()
              }
            }
          }
          
          ctx.restore()
        })
      
      return canvas
    }
  }))

  return (
    <div className="w-full h-screen flex flex-col bg-gray-100">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          {/* Left tools */}
          <div className="flex items-center space-x-2">
            <button onClick={undo} disabled={historyIndex <= 0} className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50">
              <Undo className="w-4 h-4" />
            </button>
            <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50">
              <Redo className="w-4 h-4" />
            </button>
            
            <div className="w-px h-6 bg-gray-300 mx-2" />
            
            <button onClick={addTextElement} className="p-2 border rounded hover:bg-gray-50">
              <Type className="w-4 h-4" />
            </button>
            <button onClick={() => addShapeElement('rectangle')} className="p-2 border rounded hover:bg-gray-50">
              <Square className="w-4 h-4" />
            </button>
            <button onClick={() => addShapeElement('circle')} className="p-2 border rounded hover:bg-gray-50">
              <Circle className="w-4 h-4" />
            </button>
            <label className="p-2 border rounded hover:bg-gray-50 cursor-pointer">
              <ImageIcon className="w-4 h-4" />
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          {/* Center controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button onClick={() => setZoom(Math.max(0.25, zoom - 0.25))} className="p-1 border rounded">
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-sm font-mono">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(Math.min(2, zoom + 0.25))} className="p-1 border rounded">
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-2 border rounded ${showGrid ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowLayersPanel(!showLayersPanel)}
              className={`p-2 border rounded ${showLayersPanel ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}`}
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel - Layers */}
        {showLayersPanel && (
          <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Layers</h3>
              <div className="space-y-2">
                {elements
                  .sort((a, b) => b.zIndex - a.zIndex)
                  .map((element, index) => (
                    <div
                      key={element.id}
                      className={`p-2 border rounded cursor-pointer flex items-center space-x-2 ${
                        selectedElement === element.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedElement(element.id)}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleElementVisibility(element.id)
                        }}
                        className="p-1"
                      >
                        {element.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {element.type === 'text' ? element.content : `${element.type} ${element.shapeType || ''}`}
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.round(element.width)} × {Math.round(element.height)}
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            moveElementLayer(element.id, 'up')
                          }}
                          className="p-0.5 text-gray-400 hover:text-gray-600"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            moveElementLayer(element.id, 'down')
                          }}
                          className="p-0.5 text-gray-400 hover:text-gray-600"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                {elements.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <Layers className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">No elements yet</p>
                    <p className="text-xs">Add text, shapes, or images</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Canvas area */}
        <div className="flex-1 overflow-auto bg-gray-200 p-8">
          <div className="flex items-center justify-center min-h-full">
            <div
              ref={editorRef}
              className="relative bg-white shadow-lg"
              style={{
                width: labelDimensions.width * zoom,
                height: labelDimensions.height * zoom,
                transform: `scale(${zoom})`,
                transformOrigin: 'top left'
              }}
            >
              {/* Grid overlay */}
              {showGrid && (
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, #ccc 1px, transparent 1px),
                      linear-gradient(to bottom, #ccc 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}
                />
              )}
              
              {/* Render elements */}
              {renderElements()}
              
              {/* Canvas click handler */}
              <div
                className="absolute inset-0"
                onClick={() => setSelectedElement(null)}
              />
            </div>
          </div>
        </div>

        {/* Right panel - Properties */}
        {showPropertiesPanel && (
          <div className="w-64 bg-white border-l border-gray-200 overflow-y-auto">
            <PropertiesPanel />
          </div>
        )}
      </div>
    </div>
  )
})

LabelEditor.displayName = 'LabelEditor'

export default LabelEditor
