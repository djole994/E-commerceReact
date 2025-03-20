import './App.css';
import Layout from './Components/Layout/Layout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductList from './Components/Product/Product';
import CategoryList from './Components/Category/CategoryList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout kao parent koji stalno prikazuje header/footer */}
        <Route path="/" element={<Layout />}>
          {/* index ruta prikazuje kategorije */}
          <Route index element={<CategoryList />} />
          {/* prikaz proizvoda po kategoriji */}
          <Route path="category/:categoryId" element={<ProductList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
