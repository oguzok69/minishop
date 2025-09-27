import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Catalog from "./pages/Catalog";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import "./styles/app.css"
import { useEffect, useMemo, useState } from "react";

export default function App() {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem("cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch {
      // молча игнорируем ошибки записи
    }
  }, [cart]);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + (item.qty || 0), 0),
    [cart]
  );

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * (item.qty || 0), 0),
    [cart]
  );  

  function addToCart(product) {
    setCart(prev => {
      const idx = prev.findIndex(p => p.id === product.id);
      if (idx === -1) {
        return [...prev, { id: product.id, title: product.title, price: product.price, thumbnail: product.thumbnail, qty: 1 }];
      }
      const next = [...prev];
      next[idx] = { ...next[idx], qty: (next[idx].qty || 0) + 1 };
      return next;
    });
  }

  function inc(id) {
    setCart(prev => {
      const idx = prev.findIndex(p => p.id === id);
      if (idx === -1) return prev;
      const next = [...prev];
      next[idx] = { ...next[idx], qty: (next[idx].qty || 0) + 1 };
      return next;
    });
  }

  function dec(id){
    setCart(prev => {
      const idx = prev.findIndex(p => p.id === id);
      if (idx === -1) return prev;
      const current = prev[idx];
      const newQty = (current.qty || 0) - 1;
      if (newQty <= 0) {
        return prev.filter(p => p.id !== id);
      }
      const next = [...prev];
      next[idx] = { ...current, qty: newQty }
      return next;
    });
  }

  function removeItem(id){
    setCart(prev => prev.filter(p => p.id !== id));
  }
  return (
    <div className="App">
      <Header cartCount={cartCount}/>
      <Routes>
        <Route path="/" element={<Catalog onAddToCart={addToCart}/>}></Route>
        <Route path="/product/:id" element={<Product onAddToCart={addToCart}/>}/>
        <Route path="/cart" element={<Cart  cart={cart} cartTotal={cartTotal} onInc={inc} onDec={dec} onRemove={removeItem}/>}></Route>
      </Routes>
    </div>
  );
}


