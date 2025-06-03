import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

interface SizeQuantity {
  size: string;
  quantity: number;
}

const tshirtSuppliers = [
  {
    name: "Canada Sportswear",
    url: "https://canadasportswear.com",
    categories: [
      { name: "T-shirts", url: "https://canadasportswear.com/collections/t-shirts" },
      { name: "Outerwear", url: "https://canadasportswear.com/collections/outerwear" },
      { name: "Workwear", url: "https://canadasportswear.com/collections/workwear" },
      { name: "Headwear", url: "https://canadasportswear.com/collections/headwear" }
    ]
  },
  {
    name: "Gildan",
    url: "https://www.gildanbrands.com/",
  },
  {
    name: "Bella+Canvas",
    url: "https://www.bellacanvas.com/",
  },
  {
    name: "Next Level Apparel",
    url: "https://www.nextlevelapparel.com/",
  },
  {
    name: "Hanes",
    url: "https://www.hanes.com/",
  },
  // Add more as needed
];

const SUPPLIERS = [
  'Canada Sportswear',
  'S&S Activewear',
  'Stormtech',
  'AJM International',
  'Big K Clothing',
  'Magnus Pen',
];
const MAX_CARDS = 5;

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();
  
  // Find the product
  const product = products.find(p => p.id === id);
  
  // State for selected color and size quantities
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [sizeQuantities, setSizeQuantities] = useState<SizeQuantity[]>([]);
  // Logo upload state
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  // Modal state for enlarged image
  const [modalProduct, setModalProduct] = useState<null | typeof products[0]>(null);

  // Initialize size quantities if not set (patched infinite loop)
  useEffect(() => {
    if (product && sizeQuantities.length === 0) {
      setSizeQuantities(product.sizes.map(size => ({ size, quantity: 0 })));
    }
  }, [product]);

  if (!product) {
    return <div>Product not found</div>;
  }

  const totalQuantity = sizeQuantities.reduce((sum, sq) => sum + sq.quantity, 0);

  const handleAddToCart = () => {
    if (totalQuantity < product.minOrder) {
      alert(`Minimum order quantity is ${product.minOrder} units`);
      return;
    }
    if (!selectedColor) {
      alert('Please select a color');
      return;
    }

    // Add to cart with size breakdown
    addToCart({
      ...product,
      selectedColor,
      sizeBreakdown: sizeQuantities.filter(sq => sq.quantity > 0),
      quantity: totalQuantity,
    });

    // Reset form
    setSelectedColor('');
    setSizeQuantities(product.sizes.map(size => ({ size, quantity: 0 })));
  };

  // Find products in the same category
  const categoryProducts = products.filter(
    p => p.category === product.category
  );
  // Group by supplier
  const productsBySupplier = categoryProducts.reduce((acc, p) => {
    const supplier = p.supplier;
    if (!acc[supplier]) acc[supplier] = [];
    acc[supplier].push(p);
    return acc;
  }, {} as Record<string, typeof products>);

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>{product.name} - DirectPromo</title>
        <meta name="description" content={product.description} />
      </Head>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center text-sm text-gray-600">
          <Link href="/" className="hover:text-red-600">Home</Link>
          <span className="mx-2">→</span>
          <Link href="/category/apparel" className="hover:text-red-600">Products</Link>
          <span className="mx-2">→</span>
          <Link href={`/category/${product.category}`} className="hover:text-red-600">
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </Link>
          <span className="mx-2">→</span>
          <span className="text-gray-900">{product.name}</span>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image + Logo Upload */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <div className="w-full aspect-[16/9] md:aspect-[32/3] lg:aspect-[16/9] bg-black rounded-xl overflow-hidden relative flex items-center justify-center mt-8 shadow-lg md:max-w-[470px] md:mx-auto">
              <div className="w-full h-full flex items-center justify-center p-2">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={1600}
                  height={700}
                  className="object-contain"
                  style={{ maxWidth: '80%', maxHeight: '80%' }}
                  priority
                />
              </div>
              {/* Logo overlay */}
              {logoPreview && (
                <Image
                  src={logoPreview}
                  alt="Logo Preview"
                  width={200}
                  height={200}
                  className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 object-contain pointer-events-none opacity-90"
                  style={{ maxWidth: '40%', maxHeight: '40%' }}
                />
              )}
            </div>
            {/* Logo Upload */}
            <div className="flex flex-col items-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Your Logo (PNG, JPG, SVG, max 5MB)</label>
              <input
                type="file"
                accept="image/png, image/jpeg, image/svg+xml"
                onChange={e => {
                  setLogoError(null);
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 5 * 1024 * 1024) {
                    setLogoError('File size must be 5MB or less.');
                    return;
                  }
                  if (!['image/png', 'image/jpeg', 'image/svg+xml'].includes(file.type)) {
                    setLogoError('Please upload a PNG, JPG, or SVG image.');
                    return;
                  }
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setLogoPreview(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }}
                className="mb-2"
              />
              {logoError && <div className="text-xs text-red-600 mb-1">{logoError}</div>}
              {logoPreview && (
                <button
                  type="button"
                  onClick={() => setLogoPreview(null)}
                  className="text-xs text-red-600 hover:text-red-700 mt-1"
                >
                  Remove Logo
                </button>
              )}
            </div>
            {/* Suppliers Section for Premium Cotton T-Shirt (moved under image) */}
            {product.id === 'premium-tshirt' && (
              <div className="mt-12 mb-8">
                <h2 className="text-lg font-semibold mb-3">Our T-Shirt Suppliers</h2>
                <div className="flex flex-wrap gap-3 gap-y-3 items-center">
                  {tshirtSuppliers.map((supplier) => (
                    <div key={supplier.name} className="flex flex-col gap-2">
                      <a
                        href={supplier.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-w-[140px] h-10 flex items-center justify-center px-4 rounded-lg border border-gray-300 bg-white shadow hover:bg-red-50 hover:border-red-400 transition text-base font-medium text-gray-900 text-center"
                        style={{ textDecoration: 'none' }}
                      >
                        {supplier.name}
                      </a>
                      {supplier.categories && (
                        <div className="flex flex-wrap gap-2 justify-center">
                          {supplier.categories.map(category => (
                            <a
                              key={category.name}
                              href={category.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-gray-600 hover:text-red-600"
                            >
                              {category.name}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Note: While prices shown on supplier websites are retail rates, we purchase at distributor rates to offer you the best possible pricing.
                </p>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="mt-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <div className="text-2xl text-gray-900 mb-6">
              {product.price !== undefined ? (
                <>From <span className="font-bold">${product.price.toFixed(2)}</span></>
              ) : (
                <span className="italic text-gray-400">Call for Pricing</span>
              )}
            </div>
            <p className="text-gray-600 mb-8">{product.description}</p>

            {/* Features */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Features</h2>
              <ul className="space-y-2 text-gray-600">
                <li>• 100% combed ring-spun cotton</li>
                <li>• Pre-shrunk fabric</li>
                <li>• Seamless collar</li>
                <li>• Double-needle stitching throughout</li>
                <li>• Available in men&apos;s, women&apos;s, and unisex styles</li>
                <li>• Screen printing, embroidery, or heat transfer options</li>
              </ul>
            </div>

            {/* Color Selection */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Color</h2>
              <div className="flex flex-wrap gap-3">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-full border ${
                      selectedColor === color
                        ? 'border-red-600 bg-red-50 text-red-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Quantities */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Size Breakdown</h2>
              <div className="text-gray-600">
                Minimum order: {product.minOrder} units
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={totalQuantity < product.minOrder || !selectedColor}
              className={`w-full py-4 px-8 rounded-lg text-white font-semibold ${
                totalQuantity >= product.minOrder && selectedColor
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {totalQuantity < product.minOrder
                ? `Minimum ${product.minOrder} units required`
                : !selectedColor
                ? 'Select a color'
                : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>

      {/* Supplier Grid */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Explore More {product.category.charAt(0).toUpperCase() + product.category.slice(1)} by Supplier</h2>
        {SUPPLIERS.map((supplier) => {
          const supplierProducts = productsBySupplier[supplier] || [];
          let cards: (typeof supplierProducts[number] | null)[] = [];
          if (supplier === 'Canada Sportswear') {
            cards = supplierProducts.slice(0, 4);
            while (cards.length < 4) cards.push(null);
          } else {
            cards = supplierProducts.slice(0, 4);
            while (cards.length < 4) cards.push(null);
          }
          return (
            <div key={supplier} className="mb-12">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">{supplier}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {cards.map((p, idx) =>
                  p ? (
                    <button
                      key={p.id}
                      className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center p-4 min-h-[240px] w-full focus:outline-none group"
                      onClick={() => setModalProduct(p)}
                      type="button"
                    >
                      <div className="relative w-36 h-36 mb-3 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="w-full text-base font-semibold text-gray-900 text-center truncate" title={p.name}>{p.name}</div>
                      {p.brand && <div className="w-full text-xs text-gray-500 text-center truncate" title={p.brand}>{p.brand}</div>}
                    </button>
                  ) : (
                    <div key={idx} className="bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center min-h-[240px] p-4 opacity-60">
                      <span className="text-gray-300 text-3xl">—</span>
                    </div>
                  )
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