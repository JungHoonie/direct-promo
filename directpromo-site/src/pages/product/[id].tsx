import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { products } from '@/data/products';

interface SizeQuantity {
  size: string;
  quantity: number;
}

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query;
  
  // Find the product
  const product = products.find(p => p.id === id);
  
  // State for selected color and size quantities
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [sizeQuantities, setSizeQuantities] = useState<SizeQuantity[]>([]);
  const [isCustomizing, setIsCustomizing] = useState(false);
  // Logo upload state
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);

  // Only show t-shirt mockup for t-shirt products
  const isTShirt = product && product.category === 'apparel' && product.name.toLowerCase().includes('shirt');
  const tshirtMockup = {
    label: 'T-Shirt',
    image: 'https://pngimg.com/d/tshirt_PNG5422.png', // Plain white t-shirt PNG with transparent background
    logoStyle: {
      top: '36%',
      left: '36%',
      width: '25%',
      maxWidth: '200px',
      maxHeight: '200px',
      transform: 'translate(-50%, -50%)',
    },
  };

  // Initialize size quantities if not set
  useEffect(() => {
    if ((product?.sizes ?? []).length > 0 && sizeQuantities.length === 0) {
      setSizeQuantities((product?.sizes ?? []).map(size => ({ size, quantity: 0 })));
    }
  }, [product, sizeQuantities.length]);

  if (!product) {
    return <div>Product not found</div>;
  }

  const totalQuantity = sizeQuantities.reduce((sum, sq) => sum + sq.quantity, 0);
  const totalPrice = totalQuantity * (product?.price ?? 0);

  const updateQuantity = (size: string, quantity: number) => {
    setSizeQuantities(prev =>
      prev.map(sq =>
        sq.size === size ? { ...sq, quantity: Math.max(0, quantity) } : sq
      )
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>{product?.name ?? 'Product'} - DirectPromo</title>
        <meta name="description" content={product?.description ?? ''} />
      </Head>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center text-sm text-gray-600">
          <Link href="/" className="hover:text-red-600">Home</Link>
          <span className="mx-2">→</span>
          <Link href="/category/apparel" className="hover:text-red-600">Products</Link>
          <span className="mx-2">→</span>
          <Link href={`/category/${product?.category ?? ''}`} className="hover:text-red-600">
            {(product?.category ?? '').charAt(0).toUpperCase() + (product?.category ?? '').slice(1)}
          </Link>
          <span className="mx-2">→</span>
          <span className="text-gray-900">{product?.name ?? 'Product'}</span>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image + Logo Upload */}
          <div className="space-y-4">
            <div className="w-full h-[300px] bg-gray-100 rounded-lg overflow-hidden relative flex items-center justify-center">
              <img
                src={isTShirt ? tshirtMockup.image : product?.image ?? ''}
                alt={product?.name ?? 'Product'}
                className="w-full h-full object-contain"
              />
              {/* Logo overlay */}
              {logoPreview && isTShirt && (
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  style={{
                    position: 'absolute',
                    ...tshirtMockup.logoStyle,
                    objectFit: 'contain',
                    aspectRatio: 'auto',
                    pointerEvents: 'none',
                    opacity: 0.92,
                  }}
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
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{product?.name ?? 'Product'}</h1>
            <div className="text-2xl text-gray-900 mb-6">
              {product?.price !== undefined ? (
                <>From <span className="font-extrabold">${(product?.price ?? 0).toFixed(2)}</span></>
              ) : (
                <span className="italic text-gray-400">Call for Pricing</span>
              )}
            </div>
            <p className="text-gray-600 mb-8">{product?.description ?? ''}</p>

            {/* Features */}
            <div className="mb-8">
              <h2 className="text-xl font-extrabold mb-4">Features</h2>
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
              <h2 className="text-xl font-extrabold mb-4">Available Colors</h2>
              <div className="flex flex-wrap gap-3">
                {(product?.colors ?? []).map(color => (
                  <span
                    key={color}
                    className="px-4 py-2 rounded-full border border-gray-300"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>

            {/* Size Quantities */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-extrabold">Available Sizes</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {(product?.sizes ?? []).map(size => (
                  <span
                    key={size}
                    className="px-4 py-2 rounded-full border border-gray-300"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 