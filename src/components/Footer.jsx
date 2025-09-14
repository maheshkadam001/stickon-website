import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Sticker, 
  Phone, 
  Mail, 
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-2 rounded-lg">
                <Sticker className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">StickOn</h1>
                <p className="text-sm text-gray-300">Design. Print. Stick.</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Create professional custom labels for any occasion. From water bottles to packaging, 
              our platform makes designing and ordering labels simple and affordable.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/create-label" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Create Label
                </Link>
              </li>
              <li>
                <Link to="/ai-designer" className="text-gray-300 hover:text-white transition-colors duration-200">
                  AI Designer
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className="text-gray-300 hover:text-white transition-colors duration-200">
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300">+91 93226 17530</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300">stickon@gmail.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-primary-400 mt-1" />
                <span className="text-gray-300">
                  MIT Alandi<br />
                  Pune, Maharashtra<br />
                  412105, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2024 StickOn. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer