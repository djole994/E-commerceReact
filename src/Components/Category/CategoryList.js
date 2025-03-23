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

// Mapiranje kategorija na ikonice
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

  const fetchCategories = async () => {
    try {
      const response = await api.get("/Category");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="category-container">
      {/* Hero Section */}
      <HeroSection />

      <h2>Categories</h2>
      <div className="category-grid">
        {categories.map((cat) => (
          <Link to={`/category/${cat.id}`} key={cat.id}>
            <div className="category-card">
              <div className="icon-wrapper">
                {iconMapping[cat.name] ? (
                  <FontAwesomeIcon icon={iconMapping[cat.name]} size="2x" />
                ) : (
                  <img alt={cat.name} src={cat.imageUrl} className="category-image" />
                )}
              </div>
              <h3>{cat.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
