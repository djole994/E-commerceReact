import React, { useEffect, useState } from "react";
import api from "../../Api";
import "./HeroSection.css";

const HeroSection = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchDiscountedProducts = async () => {
      try {
        const response = await api.get("/Product/Discounted");
        setFeaturedProducts(response.data);
      } catch (error) {
        console.error("Error fetching discounted products:", error);
      }
    };

    fetchDiscountedProducts();
  }, []);

  return (
    <div className="hero-section">
      <h2>Special Offers</h2>
      <div className="hero-products">
        {featuredProducts.map((prod) => (
          <div key={prod.id} className="hero-product-card">
            <img
              src={`http://localhost:5199/${prod.imageUrl}`}
              alt={prod.name}
              className="hero-product-image"
            />
            <h3>{prod.name}</h3>
            {prod.isDiscounted ? (
              <p className="hero-discounted-price">
                <span className="hero-original-price">{prod.price} KM</span>
                {prod.discountPrice} KM
              </p>
            ) : (
              <p className="hero-product-price">{prod.price} KM</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
