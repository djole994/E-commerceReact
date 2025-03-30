import React, { useState, useEffect } from 'react';
import './Slider.css';

const Slider = () => {
  const images = [
    "http://localhost:5199/img/slider.png",
    "http://localhost:5199/img/slider-2.png"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatsko mijenjanje slika na svakih 4 sekunde
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Ručno prebacivanje na određeni slajd (kod klika na tačkicu)
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="slider">
      {/* "traka" sa svim slikama - pomjeramo je 'translateX' */}
      <div
        className="slider-inner"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <div className="slider-item" key={index}>
            <img src={src} alt={`Slide ${index}`} />
          </div>
        ))}
      </div>

      {/* Dot navigacija */}
      <div className="slider-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentIndex === index ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Slider;
