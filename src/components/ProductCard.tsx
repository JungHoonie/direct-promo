import React from 'react';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
      <div className="h-48 bg-gray-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
        {/* Placeholder for product image */}
        <span className="text-gray-400">{product?.name ?? 'Product'}</span>
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{product?.name ?? 'Product'}</h3>
      <p className="text-gray-600 mb-4">{product?.description ?? ''}</p>
      <div className="mb-4">
        {product?.price !== undefined ? (
          <p className="text-2xl font-bold text-red-600">${(product?.price ?? 0).toFixed(2)}</p>
        ) : (
          <p className="text-2xl font-bold text-gray-400 italic">Call for Pricing</p>
        )}
      </div>
      
      {product?.sizes && product.sizes.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Available Sizes</label>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <span key={size} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                {size}
              </span>
            ))}
          </div>
        </div>
      )}

      {product?.colors && product.colors.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Available Colors</label>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <span key={color} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                {color}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 