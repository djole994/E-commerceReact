import './App.css';
import Layout from './Components/Layout/Layout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductList from './Components/Product/Product';
import CategoryList from './Components/Category/CategoryList';
import CartPage from "./Components/Cart/CartPage";
import ProductDetail from './Components/Product/ProductDetail';
import CheckoutPage from './Components/Cart/CheckoutPage';
import NewsletterForm from './Components/NewsletterForm/NewsletterForm';
import Slider from './Components/Slider/Slider';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Home - prikaže CategoryList */}
          <Route index element={<CategoryList />} />
          <Route element={<NewsletterForm/>}/>
          <Route element={<Slider/>}/>
          {/* Proizvodi po kategoriji */}
          <Route path="category/:categoryId" element={<ProductList />} />
          {/* Detalji proizvoda */}
          <Route path="product/:id" element={<ProductDetail />} />
          {/* Korpa */}
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
