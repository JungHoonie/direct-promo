import React, { useState } from 'react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] || '');
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    // Construct CartItem
    const cartItem = {
      ...product,
      selectedColor,
      sizeBreakdown: [{ size: selectedSize, quantity: 1 }],
      quantity: 1,
    };
    addToCart(cartItem);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
      <div className="h-48 bg-gray-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
        {/* Placeholder for product image */}
        <span className="text-gray-400">{product.name}</span>
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{product.name}</h3>
      <p className="text-gray-600 mb-4">{product.description}</p>
      <div className="mb-4">
        <p className="text-2xl font-bold text-red-600">${product.price.toFixed(2)}</p>
      </div>
      
      {product.sizes && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {product.sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}

      {product.colors && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {product.colors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        onClick={handleAddToCart}
        className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
      >
        Add to Cart
      </button>
    </div>
  );
} 