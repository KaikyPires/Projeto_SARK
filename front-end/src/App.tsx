import React, { useState } from 'react';
import { products } from './data/products';
import { CartItem, Product, Size } from './types';
import Header from './components/Header';
import Cart from './components/Cart';
import Banner from './components/Banner';
import Checkout from './components/Checkout';
import ProductPanel from './components/ProductPanel';
import ProductDetails from './components/ProductDetails';
import Footer from './components/Footer';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, size: Size) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id && item.size === size);
      
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, size, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, size: Size, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId && item.size === size
          ? { ...item, quantity }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeItem = (productId: string, size: Size) => {
    setCartItems(prev =>
      prev.filter(item => !(item.id === productId && item.size === size))
    );
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Header
        onCartClick={() => setIsCartOpen(true)}
        cartItems={cartItems}
      />
      
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={handleCheckout}
      />

      <Checkout
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
      />

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onAddToCart={addToCart}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <main className="pt-16 snap-y snap-mandatory h-screen overflow-y-auto">
        <Banner />
        {products.map(product => (
          <ProductPanel
            key={product.id}
            product={product}
            onAddToCart={addToCart}
            onViewDetails={setSelectedProduct}
          />
        ))}
      </main>

      <Footer />
    </div>
  );
}

export default App;