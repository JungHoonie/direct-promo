export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  minOrder: number;
  category: string;
  image: string;
  colors: string[];
  sizes: string[];
}

export const products: Product[] = [
  {
    id: 'premium-tshirt',
    name: 'Premium Cotton T-Shirt',
    description: 'High-quality cotton t-shirt perfect for custom printing',
    price: 9.99,
    minOrder: 24,
    category: 'apparel',
    image: '/images/products/tshirt.jpg',
    colors: ['White', 'Black', 'Navy', 'Gray', 'Red'],
    sizes: ['S', 'M', 'L', 'XL', '2XL']
  },
  {
    id: 'classic-polo',
    name: 'Classic Polo Shirt',
    description: 'Professional polo shirt for corporate wear',
    price: 14.50,
    minOrder: 24,
    category: 'apparel',
    image: '/images/products/polo.jpg',
    colors: ['White', 'Black', 'Navy', 'Red', 'Forest Green'],
    sizes: ['S', 'M', 'L', 'XL', '2XL']
  },
  {
    id: 'zip-hoodie',
    name: 'Zip-Up Hoodie',
    description: 'Comfortable zip-up hoodie for all seasons',
    price: 24.99,
    minOrder: 20,
    category: 'apparel',
    image: '/images/products/hoodie.jpg',
    colors: ['Black', 'Gray', 'Navy', 'Maroon'],
    sizes: ['S', 'M', 'L', 'XL', '2XL']
  },
  {
    id: 'lightweight-jacket',
    name: 'Lightweight Jacket',
    description: 'Stylish and practical lightweight jacket',
    price: 34.75,
    minOrder: 15,
    category: 'apparel',
    image: '/images/products/jacket.jpg',
    colors: ['Black', 'Navy', 'Gray', 'Khaki'],
    sizes: ['S', 'M', 'L', 'XL', '2XL']
  }
]; 