import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../Api";
import { CartContext } from "../../Components/Cart/CartContext";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProductById = async () => {
      try {
        const response = await api.get(`/Product/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProductById();
  }, [id]);

  if (!product) {
    return <div>Loading product...</div>;
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="product-detail-container">
      <div className="product-detail-image">
        <img
          src={`http://localhost:5199/${product.imageUrl}`}
          alt={product.name}
        />
      </div>
      <div className="product-detail-info">
        <h2>{product.name}</h2>
        <p className="product-detail-description">{product.description}</p>
        {product.isDiscounted ? (
          <p className="discounted-price">
            <span className="original-price">{product.price} KM</span>
            {product.discountPrice} KM
          </p>
        ) : (
          <p className="product-price">{product.price} KM</p>
        )}
        <button onClick={handleAddToCart} className="add-to-cart-button">
          Add to Cart
        </button>

        <Link to="/" className="back-button">
          &larr; Back to Products
        </Link>
      </div>
    </div>
  );
};

export default ProductDetail;
