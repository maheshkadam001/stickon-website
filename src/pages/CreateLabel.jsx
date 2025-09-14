import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import jsPDF from 'jspdf'
import LabelEditor from '../components/LabelEditor'
import DragDropHandler from '../components/DragDropHandler'
import { 
  ArrowLeft, 
  Download, 
  ShoppingCart, 
  Save,
  Settings,
  FileText,
  Printer
} from 'lucide-react'

const CreateLabel = () => {
  const [showDownloadOptions, setShowDownloadOptions] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [labelSettings, setLabelSettings] = useState({
    width: 400,
    height: 200,
    units: 'px',
    resolution: 300,
    name: 'My Label'
  })
  const editorRef = useRef(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  // Handle image drop from drag and drop
  const handleImageDrop = (file) => {
    // This will be handled by the LabelEditor component through props
    console.log('Image dropped:', file.name)
  }

  // Export label in different formats
  const exportLabel = async (format) => {
    if (!editorRef.current) return

    try {
      // Get the label data from the editor
      const labelData = editorRef.current.getLabelData()
      
      if (format === 'pdf') {
        const pdf = new jsPDF({
          orientation: labelSettings.width > labelSettings.height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [labelSettings.width + 40, labelSettings.height + 40]
        })
        
        // Generate canvas from editor
        const canvas = editorRef.current.getCanvas()
        const imageData = canvas.toDataURL('image/png')
        
        pdf.addImage(imageData, 'PNG', 20, 20, labelSettings.width, labelSettings.height)
        pdf.save(`${labelSettings.name}.pdf`)
      } else {
        // Handle other formats (PNG, JPG, SVG)
        const canvas = editorRef.current.getCanvas()
        const link = document.createElement('a')
        link.download = `${labelSettings.name}.${format}`
        link.href = canvas.toDataURL(`image/${format}`)
        link.click()
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('Error exporting label. Please try again.')
    }
    
    setShowDownloadOptions(false)
  }

  // Save label design
  const saveLabel = () => {
    if (!editorRef.current) return
    
    try {
      const labelData = editorRef.current.getLabelData()
      const savedLabels = JSON.parse(localStorage.getItem('savedLabels') || '[]')
      const newLabel = {
        id: Date.now(),
        name: labelSettings.name,
        data: labelData,
        settings: labelSettings,
        createdAt: new Date().toISOString()
      }
      
      savedLabels.push(newLabel)
      localStorage.setItem('savedLabels', JSON.stringify(savedLabels))
      alert('Label saved successfully!')
    } catch (error) {
      console.error('Save error:', error)
      alert('Error saving label. Please try again.')
    }
  }

  // Handle order
  const handleOrder = () => {
    if (!user) {
      navigate('/login')
      return
    }
    setShowOrderModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Advanced Label Editor</h1>
              <p className="text-sm text-gray-500">Create professional labels with advanced tools</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Label Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
            
            <button
              onClick={saveLabel}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              
              {showDownloadOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                  {['png', 'jpg', 'svg', 'pdf'].map(format => (
                    <button
                      key={format}
                      onClick={() => exportLabel(format)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Export as {format.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={handleOrder}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Order Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 relative">
        <DragDropHandler onImageDrop={handleImageDrop}>
          <LabelEditor 
            ref={editorRef}
            initialSettings={labelSettings}
            onSettingsChange={setLabelSettings}
          />
        </DragDropHandler>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Label Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Label Name</label>
                <input
                  type="text"
                  value={labelSettings.name}
                  onChange={(e) => setLabelSettings({ ...labelSettings, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter label name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Width</label>
                  <input
                    type="number"
                    value={labelSettings.width}
                    onChange={(e) => setLabelSettings({ ...labelSettings, width: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="50"
                    max="1000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                  <input
                    type="number"
                    value={labelSettings.height}
                    onChange={(e) => setLabelSettings({ ...labelSettings, height: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="50"
                    max="1000"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Units</label>
                <select
                  value={labelSettings.units}
                  onChange={(e) => setLabelSettings({ ...labelSettings, units: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="px">Pixels (px)</option>
                  <option value="mm">Millimeters (mm)</option>
                  <option value="in">Inches (in)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resolution (DPI)</label>
                <select
                  value={labelSettings.resolution}
                  onChange={(e) => setLabelSettings({ ...labelSettings, resolution: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={150}>150 DPI (Screen)</option>
                  <option value={300}>300 DPI (Print)</option>
                  <option value={600}>600 DPI (High Quality)</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Printer className="h-5 w-5" />
              <span>Order Professional Print</span>
            </h3>
            <p className="text-gray-600 mb-6">
              Ready to order professional prints of your label? Our high-quality printing service 
              delivers directly to your door.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Print Specifications</h4>
                  <p className="text-sm text-blue-700">
                    Size: {labelSettings.width} × {labelSettings.height} {labelSettings.units}<br />
                    Resolution: {labelSettings.resolution} DPI<br />
                    Professional vinyl material, waterproof
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowOrderModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Not Now
              </button>
              <button
                onClick={() => {
                  setShowOrderModal(false)
                  navigate('/contact')
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Quote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateLabel