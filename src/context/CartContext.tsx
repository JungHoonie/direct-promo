import React, { createContext, useContext, useState } from 'react';
import { Product } from '@/data/products';

interface SizeQuantity {
  size: string;
  quantity: number;
}

interface CartItem extends Product {
  selectedColor: string;
  sizeBreakdown: SizeQuantity[];
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: string, color: string) => void;
  updateQuantity: (productId: string, size: string, newQuantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: CartItem) => {
    setItems(prevItems => {
      // Find if product with same ID and color exists
      const existingItemIndex = prevItems.findIndex(
        item => item.id === product.id && item.selectedColor === product.selectedColor
      );

      if (existingItemIndex >= 0) {
        // Update existing item's quantities
        const updatedItems = [...prevItems];
        const existingItem = updatedItems[existingItemIndex];
        
        // Merge size quantities
        const updatedSizeBreakdown = [...existingItem.sizeBreakdown];
        product.sizeBreakdown.forEach(newSize => {
          const existingSizeIndex = updatedSizeBreakdown.findIndex(
            size => size.size === newSize.size
          );
          if (existingSizeIndex >= 0) {
            updatedSizeBreakdown[existingSizeIndex].quantity += newSize.quantity;
          } else {
            updatedSizeBreakdown.push({ ...newSize });
          }
        });

        updatedItems[existingItemIndex] = {
          ...existingItem,
          sizeBreakdown: updatedSizeBreakdown,
          quantity: updatedSizeBreakdown.reduce((sum, size) => sum + size.quantity, 0)
        };

        return updatedItems;
      }

      // Add new item
      return [...prevItems, { ...product }];
    });
  };

  const removeFromCart = (productId: string, color: string) => {
    setItems(prevItems =>
      prevItems.filter(
        item => !(item.id === productId && item.selectedColor === color)
      )
    );
  };

  const updateQuantity = (productId: string, size: string, newQuantity: number) => {
    setItems(prevItems => {
      return prevItems.map(item => {
        if (item.id !== productId) return item;

        const updatedSizeBreakdown = item.sizeBreakdown.map(sizeItem => {
          if (sizeItem.size !== size) return sizeItem;
          return { ...sizeItem, quantity: Math.max(0, newQuantity) };
        });

        const newTotalQuantity = updatedSizeBreakdown.reduce(
          (sum, size) => sum + size.quantity, 
          0
        );

        // If all sizes are 0, remove the item
        if (newTotalQuantity === 0) {
          return null;
        }

        return {
          ...item,
          sizeBreakdown: updatedSizeBreakdown,
          quantity: newTotalQuantity
        };
      }).filter((item): item is CartItem => item !== null);
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 