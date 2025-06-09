declare global {
  interface Window {
    dataLayer: any[];
  }
}

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = (label: string) => {
    if (window.dataLayer) {
      window.dataLayer.push({ event: 'nav_click', nav_label: label });
    }
  };

  const handleQuoteClick = () => {
    if (window.dataLayer) {
      window.dataLayer.push({ event: 'request_quote_click' });
    }
  };

  return (
    <nav className="bg-white text-black py-0.5 h-20 fixed top-0 left-0 w-full z-50 shadow transition-all">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center flex-shrink-0 h-20 pl-4">
          {/* Logo */}
          <Link href="/" aria-label="DirectPromo Home">
            <Image src="/images/categories/dp_logo_final.png" alt="DirectPromo logo" height={40} width={120} className="h-10 w-auto" priority />
          </Link>
        </div>
        {/* Desktop Nav - Centered */}
        <div className="hidden lg:flex flex-1 justify-center">
          <div className="flex space-x-6">
            <Link href="/#about-us" className="hover:text-red-600 font-extrabold transition-colors" onClick={() => handleNavClick('About Us')}>About Us</Link>
            <Link href="/#products" className="hover:text-red-600 font-extrabold transition-colors" onClick={() => handleNavClick('Products')}>Products</Link>
            <Link href="/#testimonials" className="hover:text-red-600 font-extrabold transition-colors" onClick={() => handleNavClick('Testimonials')}>Testimonials</Link>
            <Link href="/#faq" className="hover:text-red-600 font-extrabold transition-colors" onClick={() => handleNavClick('FAQ')}>FAQ</Link>
            <Link href="/#contact" className="hover:text-red-600 font-extrabold transition-colors" onClick={() => handleNavClick('Contact')}>Contact</Link>
          </div>
        </div>
        {/* Desktop CTA Button */}
        <div className="hidden lg:flex items-center space-x-4 pr-4">
          <Link href="/#contact" className="bg-red-600 text-white px-5 py-2 rounded font-extrabold hover:bg-red-700 transition-colors shadow-sm" onClick={handleQuoteClick}>
            Get a Quote
          </Link>
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
            <Link href="/#about-us" className="hover:text-red-600 font-extrabold text-lg transition-colors" onClick={() => setMenuOpen(false)}>About Us</Link>
            <Link href="/#products" className="hover:text-red-600 font-extrabold text-lg transition-colors" onClick={() => setMenuOpen(false)}>Products</Link>
            <Link href="/#testimonials" className="hover:text-red-600 font-extrabold text-lg transition-colors" onClick={() => setMenuOpen(false)}>Testimonials</Link>
            <Link href="/#faq" className="hover:text-red-600 font-extrabold text-lg transition-colors" onClick={() => setMenuOpen(false)}>FAQ</Link>
            <Link href="/#contact" className="hover:text-red-600 font-extrabold text-lg transition-colors" onClick={() => setMenuOpen(false)}>Contact</Link>
            <Link href="/#contact" className="bg-red-600 text-white px-6 py-3 rounded font-extrabold hover:bg-red-700 transition-colors w-full text-center shadow-sm" onClick={() => setMenuOpen(false)}>
              Get a Quote
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
} 