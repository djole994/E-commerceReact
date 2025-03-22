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

  // Slider container ref
  const heroProductsRef = useRef(null);

  // Da li je korisnik ručno kliknuo strelice ili sam skrolovao
  const [userInteracted, setUserInteracted] = useState(false);

  // Učitavanje proizvoda na popustu
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

  // Auto-scroll svake 3 sekunde (dok korisnik ne interveniše)
  useEffect(() => {
    if (userInteracted) return; // Prekid ako je korisnik već kliknuo ili skrolovao

    const interval = setInterval(() => {
      moveToNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [featuredProducts, userInteracted]);

  // Ako korisnik ručno skroluje, zaustavi auto-scroll
  const handleManualScroll = () => {
    if (!userInteracted) {
      setUserInteracted(true);
    }
  };

  useEffect(() => {
    const container = heroProductsRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleManualScroll, { once: true });

    return () => {
      container.removeEventListener("scroll", handleManualScroll, { once: true });
    };
  }, [userInteracted]);

  // Pomoćne funkcije za izračun
  const getCardWidth = () => {
    const container = heroProductsRef.current;
    if (!container) return 0;

    const cardList = container.querySelectorAll(".hero-product-card");
    if (!cardList.length) return 0;

    const firstCard = cardList[0];
    const style = window.getComputedStyle(firstCard);
    return (
      firstCard.offsetWidth +
      parseFloat(style.marginLeft) +
      parseFloat(style.marginRight)
    );
  };

  const getCurrentIndex = () => {
    const container = heroProductsRef.current;
    if (!container) return 0;

    const cardWidth = getCardWidth();
    if (!cardWidth) return 0;

    return Math.round(container.scrollLeft / cardWidth);
  };

  const getTotalCards = () => {
    const container = heroProductsRef.current;
    if (!container) return 0;

    return container.querySelectorAll(".hero-product-card").length;
  };

  // Pomjeri na sljedeću karticu
  const moveToNext = () => {
    const container = heroProductsRef.current;
    if (!container) return;

    const totalCards = getTotalCards();
    if (!totalCards) return;

    const currentIndex = getCurrentIndex();
    let nextIndex = currentIndex + 1;

    // Ako smo na zadnjoj, vraća se na prvu
    if (nextIndex >= totalCards) {
      nextIndex = 0;
    }

    const cardWidth = getCardWidth();
    container.scrollTo({
      left: nextIndex * cardWidth,
      behavior: "smooth",
    });
  };

  // Pomjeri na prethodnu karticu
  const moveToPrev = () => {
    setUserInteracted(true);
    const container = heroProductsRef.current;
    if (!container) return;

    const totalCards = getTotalCards();
    if (!totalCards) return;

    const currentIndex = getCurrentIndex();
    let prevIndex = currentIndex - 1;

    // Ako smo na prvoj, skače na zadnju
    if (prevIndex < 0) {
      prevIndex = totalCards - 1;
    }

    const cardWidth = getCardWidth();
    container.scrollTo({
      left: prevIndex * cardWidth,
      behavior: "smooth",
    });
  };

  // Ručno listanje - next
  const handleNextClick = () => {
    setUserInteracted(true);
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
        {/* Lijeva strelica */}
        <button className="slider-button slider-button-left" onClick={moveToPrev}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>

        {/* Kontejner za horizontalni scroll i snap */}
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
                      <button
                        onClick={() => handleAddToCart(prod)}
                        className="add-to-cart-button"
                      >
                        <FontAwesomeIcon icon={faCartPlus} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(prod)}
                      className="add-to-cart-button"
                    >
                      <FontAwesomeIcon icon={faCartPlus} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Desna strelica */}
        <button className="slider-button slider-button-right" onClick={handleNextClick}>
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
