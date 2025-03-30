import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../Api";
import { CartContext } from "../../Components/Cart/CartContext";
import "./ProductDetail.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";

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
    return <div className="loading-text">Loading product...</div>;
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

  const calculateDiscountPercentage = (price, discountPrice) => {
    if (price > discountPrice) {
      return Math.round(((price - discountPrice) / price) * 100);
    }
    return 0;
  };

  const discountPercentage = product.isDiscounted
    ? calculateDiscountPercentage(product.price, product.discountPrice)
    : 0;

  return (
    <div className="product-detail-container">
      <div className="product-detail-image">
        {product.isDiscounted && discountPercentage > 0 && (
          <div className="discount-badge">
            <span>Save {discountPercentage}%</span>
          </div>
        )}
        <img
          src={`http://localhost:5199/${product.imageUrl}`}
          alt={product.name}
        />
      </div>
      <div className="product-detail-info">
        <h2>{product.name}</h2>
        <ul className="product-detail-description">
          {product.description.split(",").map((item, index) => (
            <li key={index}>{item.trim()}</li>
          ))}
        </ul>

        <div className="price-cart-row">
          {product.isDiscounted && (
            <span className="original-price">{product.price} EUR</span>
          )}
          <span className="final-price">
            {product.isDiscounted ? product.discountPrice : product.price} EUR
          </span>
          <button onClick={handleAddToCart} className="add-to-cart-button">
            <FontAwesomeIcon icon={faCartPlus} /> Add to Cart
          </button>
        </div>

        <Link to="/" className="back-button">
          &larr; Back to Products
        </Link>
      </div>
    </div>
  );
};

export default ProductDetail;
