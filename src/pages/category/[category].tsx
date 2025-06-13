import { useRouter } from 'next/router';
import Head from 'next/head';
import { products } from '@/data/products';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;
  
  // Modal state for enlarged image
  const [modalProduct, setModalProduct] = useState<null | typeof products[0]>(null);

  // Filter products by category
  const categoryProducts = products.filter(
    product => product.category === category
  );

  // Group products by supplier
  const productsBySupplier = categoryProducts.reduce((acc, product) => {
    const supplier = product.supplier;
    if (!acc[supplier]) {
      acc[supplier] = [];
    }
    acc[supplier].push(product);
    return acc;
  }, {} as Record<string, typeof products>);
  
  // Get category title and description
  const getCategoryInfo = () => {
    switch(category) {
      case 'tshirts':
        return {
          title: 'T-Shirts Collection',
          description: 'High-quality custom t-shirts from trusted suppliers.\nPerfect for company uniforms, events, or promotional giveaways.',
          image: '/images/categories/t-shirt_categories.webp'
        };
      case 'outerwear':
        return {
          title: 'Outerwear Collection',
          description: 'Professional outerwear for any occasion.\nCustomize with your logo for trade shows, conferences, or corporate gifts.',
          image: '/images/categories/outerwear_image.jpeg'
        };
      case 'workwear':
        return {
          title: 'Workwear Collection',
          description: 'Durable workwear for professional environments.\nPromote your brand with custom work apparel.',
          image: '/images/categories/workwear_dp.webp'
        };
      case 'headwear':
        return {
          title: 'Headwear Collection',
          description: 'Premium headwear for every style.\nEco-friendly options perfect for corporate sustainability initiatives.',
          image: '/images/categories/headwear_img.jpeg'
        };
      default:
        return {
          title: 'Accessories Collection',
          description: 'Premium bags, drinkware, and branded essentials that elevate your brand presence and leave a lasting impression.',
          image: '/images/categories/accessories_dp.jpeg'
        };
    }
  };

  const categoryInfo = getCategoryInfo();

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>{categoryInfo.title} - DirectPromo</title>
        <meta name="description" content={categoryInfo.description} />
      </Head>

      {/* Hero Section */}
      <div className="relative h-[300px] bg-gray-900">
        <div className="absolute inset-0">
          <Image
            src={categoryInfo.image}
            alt={categoryInfo.title}
            fill
            className="object-cover opacity-50"
            priority
          />
        </div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white pt-12 md:pt-20">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{categoryInfo.title}</h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto whitespace-pre-line">{categoryInfo.description}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {Object.entries(productsBySupplier).map(([supplier, supplierProducts]) => {
          const cards = supplierProducts.slice(0, 4);
          return (
            <div key={supplier} className="mb-16">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">{supplier}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {cards.map((product) =>
                  product ? (
                    <button
                      key={product.id}
                      className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center p-4 min-h-[240px] w-full focus:outline-none group"
                      onClick={() => setModalProduct(product)}
                      type="button"
                    >
                      <div className="relative w-36 h-36 mb-3 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="w-full text-base font-semibold text-gray-900 text-center truncate" title={product.name}>{product.name}</div>
                      {product.brand && <div className="w-full text-xs text-gray-500 text-center truncate" title={product.brand}>{product.brand}</div>}
                    </button>
                  ) : null
                )}
                {/* Contact Us Card */}
                <Link href="/#contact" className="bg-red-50 border-2 border-red-200 rounded-xl flex flex-col items-center justify-center min-h-[240px] p-4 hover:bg-red-100 transition-colors group">
                  <div className="flex flex-col items-center">
                    <svg className="w-10 h-10 text-red-500 mb-2 group-hover:text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5V6.75A2.25 2.25 0 0018.75 4.5h-13.5A2.25 2.25 0 003 6.75v10.5A2.25 2.25 0 005.25 19.5h6.75" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5l-9 6-9-6" /></svg>
                    <span className="text-base font-bold text-red-600">Contact Us</span>
                    <span className="text-xs text-red-500 text-center">for more options</span>
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for enlarged product image */}
      {modalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={() => setModalProduct(null)}>
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-md w-full relative" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl font-bold focus:outline-none"
              onClick={() => setModalProduct(null)}
              aria-label="Close"
              type="button"
            >
              ×
            </button>
            <div className="flex flex-col items-center">
              <div className="relative w-64 h-64 mb-4 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                <Image
                  src={modalProduct.image}
                  alt={modalProduct.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-lg font-bold text-gray-900 mb-1 text-center">{modalProduct.name}</div>
              <div className="text-sm text-gray-500 mb-1 text-center">{modalProduct.brand || ''}</div>
              <div className="text-sm text-gray-400 mb-2 text-center">{modalProduct.description}</div>
              <div className="text-base text-gray-700 text-center">
                {modalProduct.price !== undefined ? (
                  <span>${modalProduct.price.toFixed(2)}</span>
                ) : (
                  <span className="italic text-gray-400">Call for Pricing</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 