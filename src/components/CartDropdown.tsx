import React from 'react';
import { useRouter } from 'next/router';
import { useCart } from '@/context/CartContext';

interface CartDropdownProps {
  onClose: () => void;
}

export default function CartDropdown({ onClose }: CartDropdownProps) {
  const router = useRouter();
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart();

  const handleCheckout = () => {
    onClose(); // Close the dropdown
    router.push('/checkout'); // Navigate to checkout page
  };

  if (items.length === 0) {
    return (
      <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
        <div className="text-center text-gray-500 py-8">
          Your cart is empty
        </div>
      </div>
    );
  }

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Shopping Cart</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          {items.map((item) => (
            <div key={`${item.id}-${item.selectedColor}`} className="border-b pb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-500">Color: {item.selectedColor}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id, item.selectedColor)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>

              {/* Size Breakdown */}
              <div className="space-y-2">
                {item.sizeBreakdown.map((sizeItem) => (
                  <div key={sizeItem.size} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Size {sizeItem.size}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.selectedColor,
                            sizeItem.size,
                            sizeItem.quantity - 1
                          )
                        }
                        className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:border-gray-400 text-black"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm text-black">{sizeItem.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.selectedColor,
                            sizeItem.size,
                            sizeItem.quantity + 1
                          )
                        }
                        className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:border-gray-400 text-black"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-2 text-right text-sm text-gray-600">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">Estimated Price</span>
            <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-500 mb-4">Final price may vary based on customization and quantity</p>
          <button
            onClick={handleCheckout}
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
} 