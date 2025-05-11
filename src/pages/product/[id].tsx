import { useRouter } from 'next/router';
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import CartIcon from '@/components/CartIcon';
import Image from 'next/image';

interface SizeQuantity {
  size: string;
  quantity: number;
}

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();
  
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
  if (product && sizeQuantities.length === 0) {
    setSizeQuantities(product.sizes.map(size => ({ size, quantity: 0 })));
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const totalQuantity = sizeQuantities.reduce((sum, sq) => sum + sq.quantity, 0);
  const totalPrice = totalQuantity * product.price;

  const updateQuantity = (size: string, quantity: number) => {
    setSizeQuantities(prev =>
      prev.map(sq =>
        sq.size === size ? { ...sq, quantity: Math.max(0, quantity) } : sq
      )
    );
  };

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
    setIsCustomizing(false);
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
            <div className="w-full h-[300px] bg-gray-100 rounded-lg overflow-hidden relative flex items-center justify-center">
              <Image
                src={isTShirt ? tshirtMockup.image : product.image}
                alt={product.name}
                width={600}
                height={400}
                className="w-full h-full object-cover rounded-lg"
                priority
              />
              {/* Logo overlay */}
              {logoPreview && isTShirt && (
                <Image
                  src={logoPreview}
                  alt="Logo Preview"
                  width={300}
                  height={200}
                  style={{
                    position: 'absolute',
                    ...tshirtMockup.logoStyle,
                    objectFit: 'contain',
                    aspectRatio: 'auto',
                    pointerEvents: 'none',
                    opacity: 0.92,
                  }}
                  className="w-full h-full object-cover rounded-lg"
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
                <li>• Available in men's, women's, and unisex styles</li>
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Size Breakdown</h2>
                <button
                  onClick={() => setIsCustomizing(!isCustomizing)}
                  className="text-red-600 hover:text-red-700"
                >
                  {isCustomizing ? 'Cancel' : 'Customize Quantities'}
                </button>
              </div>

              {isCustomizing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {sizeQuantities.map(({ size, quantity }) => (
                      <div key={size} className="flex items-center justify-between p-3 border rounded">
                        <span className="font-medium">{size}</span>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(size, quantity - 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                          >
                            -
                          </button>
                          <span className="w-12 text-center">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(size, quantity + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-600">Total Quantity</div>
                      <div className="text-xl font-bold">{totalQuantity} units</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Estimated Price</div>
                      <div className="text-xl font-bold">${totalPrice.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">Final price may vary</div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    Minimum order: {product.minOrder} units
                  </div>
                </div>
              ) : (
                <div className="text-gray-600">
                  Click 'Customize Quantities' to specify the number of items needed in each size.
                </div>
              )}
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