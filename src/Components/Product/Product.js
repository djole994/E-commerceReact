import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../Api";
import { CartContext } from "../../Components/Cart/CartContext";
import "./Product.css";

const ProductList = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        // Poziv na API za jednu kategoriju: /Category/1
        const response = await api.get(`/Category/${categoryId}`);
        setCategoryName(response.data.name);
      } catch (error) {
        console.error("Greška pri dohvatanju kategorije:", error);
      }
    };

    const fetchProductsByCategory = async () => {
      try {
        const response = await api.get(`/Product/ByCategory/${categoryId}`);
        setProducts(response.data);
      } catch (error) {
        console.error("Greška pri dohvatanju proizvoda:", error);
      }
    };

    if (categoryId) {
      fetchCategoryName();
      fetchProductsByCategory();
    }
  }, [categoryId]);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <div className="product-list-container">
      <h2>{categoryName}</h2>
      <div className="product-grid">
        {products.map((prod) => (
          <div key={prod.id} className="product-card">
            <img
              src={`http://localhost:5199/${prod.imageUrl}`}
              alt={prod.name}
              className="product-image"
            />
            <h3>{prod.name}</h3>
            <p className="product-description">{prod.description}</p>
            {prod.isDiscounted ? (
              <p className="discounted-price">
                <span className="original-price">{prod.price} KM</span>{" "}
                {prod.discountPrice} KM
              </p>
            ) : (
              <p className="product-price">{prod.price} KM</p>
            )}

            {/* Dugme za detalje proizvoda */}
            <Link to={`/product/${prod.id}`} className="details-button">
              Detaljno
            </Link>

            {/* Dugme za dodavanje u korpu */}
            <button
              onClick={() => handleAddToCart(prod)}
              className="add-to-cart-button"
            >
              Dodaj u korpu
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
