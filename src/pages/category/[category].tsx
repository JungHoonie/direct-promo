import { useRouter } from 'next/router';
import Head from 'next/head';
import { products } from '@/data/products';
import Link from 'next/link';
import Image from 'next/image';

export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;
  
  // Filter products by category
  const categoryProducts = products.filter(
    product => product.category === category
  );
  
  // Get category title and description
  const getCategoryInfo = () => {
    switch(category) {
      case 'apparel':
        return {
          title: 'Apparel Products',
          description: 'High-quality custom apparel including t-shirts, polos, jackets, and caps.\nPerfect for company uniforms, events, or promotional giveaways.',
          image: '/images/categories/apparel-hero.jpg'
        };
      case 'bags':
        return {
          title: 'Bags & Totes',
          description: 'Professional bags and totes for any occasion.\nCustomize with your logo for trade shows, conferences, or corporate gifts.',
          image: '/images/categories/bags-hero.jpg'
        };
      case 'tech':
        return {
          title: 'Tech Accessories',
          description: 'Modern tech accessories for the digital age.\nPromote your brand with custom gadgets and tech essentials.',
          image: '/images/categories/tech-hero.jpg'
        };
      case 'drinkware':
        return {
          title: 'Drinkware Collection',
          description: 'Premium drinkware for every beverage need.\nEco-friendly options perfect for corporate sustainability initiatives.',
          image: '/images/categories/drinkware-hero.jpg'
        };
      default:
        return {
          title: 'Products',
          description: 'Browse our collection of high-quality promotional products.\nAll items can be customized with your logo.',
          image: '/images/categories/default-hero.jpg'
        };
    }
  };

  const categoryInfo = getCategoryInfo();

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>{categoryInfo.title} - DirectPromo</title>
        <meta name="description" content={categoryInfo.description.replace('\n', ' ')} />
      </Head>

      {/* Top Navigation Bar */}
      {/* Removed duplicate nav bar. Header is now global. */}

      {/* Category Hero Banner */}
      <div className="relative h-[400px] bg-gray-900 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: `url(${categoryInfo.image})` }}
        />
        {/* Content */}
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-6">{categoryInfo.title}</h1>
            {categoryInfo.description.split('\n').map((line, index) => (
              <p key={index} className="text-xl text-gray-200">{line}</p>
            ))}
            <button className="mt-8 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center">
              Request a Quote
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-16">
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categoryProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md">
                <Link href={`/product/${product.id}`}>
                  <div className="relative w-full pt-[100%]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={300}
                      height={200}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-gray-900">
                        <span className="text-sm">From </span>
                        <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Min. {product.minOrder} units
                      </div>
                    </div>
                    <div className="w-full bg-gray-900 text-white py-2 rounded text-center hover:bg-gray-800 transition-colors">
                      View Details
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No products found in this category.</p>
            <Link href="/" className="text-red-600 hover:text-red-700 mt-4 inline-block">
              Return to Home
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-red-600">Contact Us</h3>
              <p>Email: info@directpromo.com</p>
              <p>Phone: (555) 123-4567</p>
              <p>Address: 123 Business Ave, Suite 100</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-red-600">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-red-500 transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-red-500 transition-colors">Products</Link></li>
                <li><Link href="#" className="hover:text-red-500 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-red-600">Follow Us</h3>
              <div className="flex space-x-4">
                <Link href="#" className="hover:text-red-500 transition-colors">LinkedIn</Link>
                <Link href="#" className="hover:text-red-500 transition-colors">Twitter</Link>
                <Link href="#" className="hover:text-red-500 transition-colors">Facebook</Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p>&copy; 2024 DirectPromo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 