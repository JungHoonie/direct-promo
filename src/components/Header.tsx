import { useState } from "react";
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import CartIcon from "@/components/CartIcon";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white text-black py-4 fixed top-0 left-0 w-full z-50 shadow transition-all">
      <div className="container mx-auto flex items-center justify-between px-4 lg:px-12">
        {/* Logo */}
        <a href="/" className="text-2xl font-bold text-red-600 flex-shrink-0">
          DirectPromo
        </a>
        {/* Desktop Nav - Centered */}
        <div className="hidden lg:flex flex-1 justify-center">
          <div className="flex space-x-8">
            <a href="#about" className="hover:text-red-600 font-bold transition-colors">About</a>
            <a href="#products" className="hover:text-red-600 font-bold transition-colors">Products</a>
            <a href="#testimonials" className="hover:text-red-600 font-bold transition-colors">Testimonials</a>
            <a href="#faq" className="hover:text-red-600 font-bold transition-colors">FAQ</a>
            <a href="#contact" className="hover:text-red-600 font-bold transition-colors">Contact</a>
          </div>
        </div>
        {/* Desktop CTA Button */}
        <div className="hidden lg:flex items-center space-x-4">
          <CartIcon />
          <a href="#contact" className="bg-red-600 text-white px-5 py-2 rounded font-bold hover:bg-red-700 transition-colors shadow-sm">
            Get a Quote
          </a>
        </div>
        {/* Mobile Hamburger */}
        <div className="flex lg:hidden items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 focus:outline-none transition-colors"
            aria-label="Open navigation menu"
          >
            {menuOpen ? (
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white shadow-lg absolute left-0 right-0 top-full z-50 animate-fade-in">
          <div className="flex flex-col items-center py-6 space-y-4">
            <a href="#about" className="hover:text-red-600 font-bold text-lg transition-colors" onClick={() => setMenuOpen(false)}>About</a>
            <a href="#products" className="hover:text-red-600 font-bold text-lg transition-colors" onClick={() => setMenuOpen(false)}>Products</a>
            <a href="#testimonials" className="hover:text-red-600 font-bold text-lg transition-colors" onClick={() => setMenuOpen(false)}>Testimonials</a>
            <a href="#faq" className="hover:text-red-600 font-bold text-lg transition-colors" onClick={() => setMenuOpen(false)}>FAQ</a>
            <a href="#contact" className="hover:text-red-600 font-bold text-lg transition-colors" onClick={() => setMenuOpen(false)}>Contact</a>
            <CartIcon />
            <a href="#contact" className="bg-red-600 text-white px-6 py-3 rounded font-bold hover:bg-red-700 transition-colors w-full text-center shadow-sm" onClick={() => setMenuOpen(false)}>
              Get a Quote
            </a>
          </div>
        </div>
      )}
    </nav>
  );
} 