import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import Footer from './components/Footer';
import Cart from './components/Cart';
import { getProducts, createPaymentIntent, confirmPayment } from './api';
import AddProductForm from './components/AddProductForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
// import axios from "./api"
import axios from 'axios';

function App() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const stripePromise = loadStripe('pk_test_51MH45uSCnhOlwfSWqQ09Me2bwVQ1AN9J11VTHmuQxX1E54OzQJHWIugLzR6E0RBVJrB42MI5mV5pIBxHk9Eb4bl300m7RSOmJi');

  

  // const fetchProducts = async () => {
  //   try {
  //     const response = await axios.get('https://shopsystreet-8.onrender.com/api/products',{
  //       withCredentials: true,
  //     });
  //     setProducts(response.data);
  //   } catch (error) {
  //     console.error('Error fetching products:', error);
  //   }
  // };

  // useEffect(() => {
  //   fetchProducts();
  // }, []);

   const fetchProducts = async () => {
    try {
      const response = await axios.get('https://shopsystreet-8.onrender.com/api/products', {
        withCredentials: true,
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchProducts();
    }, 5000); // Fetch every 5 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);


  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  const toggleAddProduct = () => {
    setIsAddProductOpen(!isAddProductOpen);
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const resetCart = () => {
    setCart([]);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const priceString = typeof item.price === 'string' ? item.price : item.price.toString();
      const numericPrice = parseFloat(priceString.replace(/[^0-9.-]+/g, ''));
      return total + numericPrice;
    }, 0);
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <Header toggleCart={toggleCart} toggleAddProduct={toggleAddProduct} />
        <main className="flex-grow container mx-auto p-4">
          <ProductList products={products} addToCart={addToCart} />
        </main>
        <Footer />
        {cartOpen && <Cart toggleCart={toggleCart} cart={cart} total={calculateTotal()} resetCart={resetCart} />}
        {isAddProductOpen && <AddProductForm closeForm={toggleAddProduct} />}
      </div>
    </Elements>
  );
}

export default App;

