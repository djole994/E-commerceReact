import React, { useEffect, useState } from "react";
import api from "../../Api";
import "./CategoryList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faLaptop,
    faMobileAlt,
    faMicrochip,
    faGamepad,
    faHome,
    faTv,
    faHeadphonesAlt,
    faNetworkWired,
    faClock, //  za faWatch
    faPlug
  } from "@fortawesome/free-solid-svg-icons";
  

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

  // Dohvaćanje kategorija s API-a
  const fetchCategories = async () => {
    try {
      const response = await api.get("/Category");
      setCategories(response.data);
    } catch (error) {
      console.error("Greška pri dohvatanju kategorija:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="category-container">
      <div className="category-grid">
        {categories.map((cat) => (
          <div key={cat.id} className="category-card">
            <div className="icon-wrapper">
              {iconMapping[cat.name] ? (
                <FontAwesomeIcon icon={iconMapping[cat.name]} size="2x" />
              ) : (
                <img
                  alt={cat.name}
                  src={`http://localhost:5199${cat.imageUrl}`}
                  className="category-image"
                />
              )}
            </div>
            <h3>{cat.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
