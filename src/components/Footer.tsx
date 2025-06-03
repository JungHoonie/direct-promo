import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-start justify-center h-full">
            {/* SEO: Improved alt text for logo */}
            <Image src="/images/categories/direct_promo_logo_bottom.png" alt="DirectPromo Toronto Promotional Products Logo" width={192} height={48} className="h-12 w-auto mb-4" />
            <p className="text-sm text-gray-300">Email: <a href="mailto:directpromo@rogers.com" className="text-red-400 hover:underline">directpromo@rogers.com</a></p>
            <p className="text-sm text-gray-300">Phone: <a href="tel:+14168950929" className="text-red-400 hover:underline">(416) 895-0929</a></p>
            <p className="text-sm text-gray-300">151 Beecroft Rd<br/>North York, ON M2N 7C4</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-red-600">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="#about-us" className="hover:text-red-500 transition-colors">About Us</Link></li>
              <li><Link href="#products" className="hover:text-red-500 transition-colors">Products</Link></li>
              <li><Link href="#contact" className="hover:text-red-500 transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-red-600">Follow Us</h3>
            <div className="flex space-x-4">
              <Link href="https://www.linkedin.com/in/roger-crock-28b99529/?originalSubdomain=ca" className="hover:text-red-500 transition-colors" target="_blank" rel="me noopener noreferrer">LinkedIn</Link>
              <Link href="https://twitter.com/rogerone3one" className="hover:text-red-500 transition-colors" target="_blank" rel="me noopener noreferrer">Twitter/X</Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p>&copy; 2024 DirectPromo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 