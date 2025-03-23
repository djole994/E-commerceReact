import React, { useEffect, useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../../Api";
import { CartContext } from "../../Components/Cart/CartContext";
import "./HeroSection.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const HeroSection = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const { addToCart } = useContext(CartContext);

  // Ref na slider container
  const heroProductsRef = useRef(null);

  // Kontroliramo auto-scroll – on se gasi kad korisnik klikne strelicu
  const [autoScrollActive, setAutoScrollActive] = useState(true);

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

  // Auto-scroll – pomak za cijelu vidljivu stranicu svakih 3 sekunde
  useEffect(() => {
    if (!autoScrollActive) return;

    const interval = setInterval(() => {
      moveToNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [featuredProducts, autoScrollActive]);

  // Pomak za cijelu "stranicu" (offsetWidth) slidera – time se pomiče točno onoliko artikala koliko je vidljivo
  const moveToNext = () => {
    if (!heroProductsRef.current) return;
    const container = heroProductsRef.current;
    const containerWidth = container.offsetWidth;
    const newPosition = container.scrollLeft + containerWidth;

    // Ako novi položaj prelazi ukupnu širinu, resetiramo na 0
    if (newPosition >= container.scrollWidth - 5) {
      container.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      container.scrollTo({ left: newPosition, behavior: "smooth" });
    }
  };

  const moveToPrev = () => {
    setAutoScrollActive(false);
    if (!heroProductsRef.current) return;
    const container = heroProductsRef.current;
    const containerWidth = container.offsetWidth;
    const newPosition = container.scrollLeft - containerWidth;

    if (newPosition < 0) {
      // Ako smo na početku, skrolaj na kraj
      container.scrollTo({ left: container.scrollWidth - containerWidth, behavior: "smooth" });
    } else {
      container.scrollTo({ left: newPosition, behavior: "smooth" });
    }
  };

  const handleNextClick = () => {
    setAutoScrollActive(false);
    moveToNext();
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const calculateDiscountPercentage = (price, discountPrice) => {
    if (price > discountPrice) {
      return Math.round(((price - discountPrice) / price) * 100);
    }
    return 0;
  };

  return (
    <div className="hero-section">
      <h2 className="hero-title">Special Offers</h2>

      <div className="slider-wrapper">
        {/* Strelica lijevo */}
        <button className="slider-button slider-button-left" onClick={moveToPrev}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>

        {/* Slider container – bez vidljivog scrollbar-a */}
        <div className="hero-products-container" ref={heroProductsRef}>
          <div className="hero-products">
            {featuredProducts.map((prod) => {
              const discountPercentage = prod.isDiscounted
                ? calculateDiscountPercentage(prod.price, prod.discountPrice)
                : 0;

              return (
                <div key={prod.id} className="hero-product-card">
                  <Link to={`/product/${prod.id}`} className="card-click-area">
                    {prod.isDiscounted && discountPercentage > 0 && (
                      <div className="discount-badge">
                        <span>Save {discountPercentage}%</span>
                      </div>
                    )}
                    <img
                      src={`http://localhost:5199/${prod.imageUrl}`}
                      alt={prod.name}
                      className="hero-product-image"
                    />
                    <h3>{prod.name}</h3>
                    {prod.isDiscounted ? (
                      <p className="hero-discounted-price">{prod.discountPrice} EUR</p>
                    ) : (
                      <p className="hero-product-price">{prod.price} EUR</p>
                    )}
                    <ul className="hero-product-description">
                      {prod.description.split(",").map((part, index) => (
                        <li key={index}>{part.trim()}</li>
                      ))}
                    </ul>
                  </Link>

                  {prod.isDiscounted ? (
                    <div className="price-cart-row">
                      <span className="hero-original-price">{prod.price} EUR</span>
                      <button onClick={() => handleAddToCart(prod)} className="add-to-cart-button">
                        <FontAwesomeIcon icon={faCartPlus} />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => handleAddToCart(prod)} className="add-to-cart-button">
                      <FontAwesomeIcon icon={faCartPlus} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Strelica desno */}
        <button className="slider-button slider-button-right" onClick={handleNextClick}>
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
