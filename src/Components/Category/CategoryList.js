import React, { useEffect, useState } from "react";
import api from "../../Api";
import "./CategoryList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import {
  faLaptop,
  faMobileAlt,
  faMicrochip,
  faGamepad,
  faHome,
  faTv,
  faHeadphonesAlt,
  faNetworkWired,
  faClock,
  faPlug
} from "@fortawesome/free-solid-svg-icons";
import HeroSection from "../Hero/HeroSection";
import NewsletterForm from "../NewsletterForm/NewsletterForm";
import Slider from "../Slider/Slider";

// mapiranje kategorija → ikonice
const iconMapping = {
  "Laptops & Notebooks": faLaptop,
  "Smartphones & Tablets": faMobileAlt,
  "Computer Components": faMicrochip,
  "Gaming Consoles": faGamepad,
  "Smart Home Devices": faHome,
  "TV & Home Theater": faTv,
  "Audio & Headphones": faHeadphonesAlt,
  "Networking Equipment": faNetworkWired,
  "Wearable Tech (Smartwatches, etc.)": faClock,
  "Accessories (Cables, Chargers, Cases)": faPlug
};

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/Category");
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="category-container">
      {/* full‑width slider */}
      <div className="full-width-slider">
        <Slider />
      </div>

      {/* hero sekcija */}
      <HeroSection />

      <h2>Categories</h2>

      {/* grid kategorija ili skeleton dok se učitava */}
      <div className="category-grid">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div className="category-card skeleton" key={i} />
            ))
          : categories.map((cat) => (
              <Link
                to={`/category/${cat.id}`}
                key={cat.id}
                className="category-card-link"
                aria-label={`Open category ${cat.name}`}
              >
                <article className="category-card" role="button" tabIndex={0}>
                  <div className="icon-wrapper">
                    {iconMapping[cat.name] ? (
                      <FontAwesomeIcon icon={iconMapping[cat.name]} size="lg" />
                    ) : (
                      <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        className="category-image"
                      />
                    )}
                  </div>
                  <h3>{cat.name}</h3>
                </article>
              </Link>
            ))}
      </div>

      <NewsletterForm />
    </section>
  );
};

export default CategoryList;
