import { useRouter } from 'next/router';
import { useState } from 'react';
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

  // Initialize size quantities if not set
  if (product && sizeQuantities.length === 0) {
    setSizeQuantities(product.sizes.map(size => ({ size, quantity: 0 })));
  }

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
          <div className="space-y-4">
            <div className="w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden relative flex items-center justify-center mt-8">
              <Image
                src={product.image}
                alt={product.name}
                width={600}
                height={400}
                className="w-full h-full object-cover rounded-lg"
                priority
              />
              {/* Logo overlay */}
              {logoPreview && (
                <Image
                  src={logoPreview}
                  alt="Logo Preview"
                  width={200}
                  height={200}
                  className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 object-contain pointer-events-none opacity-90"
                  style={{ maxWidth: '60%', maxHeight: '60%' }}
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
                    <a
                      key={supplier.name}
                      href={supplier.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-w-[140px] h-10 flex items-center justify-center px-4 rounded-lg border border-gray-300 bg-white shadow hover:bg-red-50 hover:border-red-400 transition text-base font-medium text-gray-900 text-center"
                      style={{ textDecoration: 'none' }}
                    >
                      {supplier.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="mt-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <div className="text-2xl text-gray-900 mb-6">
              From <span className="font-bold">${product.price.toFixed(2)}</span>
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
    </div>
  );
} 