import { renderHook, act } from '@testing-library/react'
import { CartProvider, useCart } from '@/context/CartContext'
import { Product } from '@/data/products'
import React from 'react'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
)

describe('CartContext', () => {
  it('removes only specified color variant', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    const baseProduct: Product = {
      id: 'test-product',
      name: 'Test',
      description: 'desc',
      price: 10,
      minOrder: 1,
      category: 'apparel',
      image: '',
      colors: ['Red', 'Blue'],
      sizes: ['M'],
    }

    act(() => {
      result.current.addToCart({
        ...baseProduct,
        selectedColor: 'Red',
        sizeBreakdown: [{ size: 'M', quantity: 1 }],
        quantity: 1,
      })
      result.current.addToCart({
        ...baseProduct,
        selectedColor: 'Blue',
        sizeBreakdown: [{ size: 'M', quantity: 1 }],
        quantity: 1,
      })
    })

    expect(result.current.items).toHaveLength(2)

    act(() => {
      result.current.removeFromCart('test-product', 'Red')
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].selectedColor).toBe('Blue')
  })
})
