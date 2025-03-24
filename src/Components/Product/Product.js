import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../Api";
import { CartContext } from "../../Components/Cart/CartContext";
import "./Product.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";

const ProductList = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const { addToCart } = useContext(CartContext);

  // Filter states
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchDescription, setSearchDescription] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    // Dohvati ime kategorije
    const fetchCategoryName = async () => {
      try {
        const response = await api.get(`/Category/${categoryId}`);
        setCategoryName(response.data.name);
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };

    // Dohvati proizvode iz date kategorije-
    const fetchProductsByCategory = async () => {
      try {
        const response = await api.get(`/Product/ByCategory/${categoryId}`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (categoryId) {
      fetchCategoryName();
      fetchProductsByCategory();
    }
  }, [categoryId]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await api.get("/Brand");
        setBrands(response.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    fetchBrands();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  //klijentska filtracija
  const filteredProducts = products.filter((prod) => {
    // Filtriraj po nazivu
    if (
      searchName &&
      !prod.name.toLowerCase().includes(searchName.toLowerCase())
    ) {
      return false;
    }

    // Filtriraj po brendu
    if (selectedBrand && prod.brand !== selectedBrand) {
      return false;
    }

    // Filtriraj po opisu
    if (
      searchDescription &&
      !prod.description.toLowerCase().includes(searchDescription.toLowerCase())
    ) {
      return false;
    }

    // Filtriraj po cjenovnom rasponu
    if (minPrice && prod.price < parseFloat(minPrice)) {
      return false;
    }
    if (maxPrice && prod.price > parseFloat(maxPrice)) {
      return false;
    }

    return true;
  });

  const isDiscounted = (prod) =>
    prod.discountPrice && prod.discountPrice < prod.price;

  const calculateDiscountPercentage = (price, discountPrice) => {
    if (price > discountPrice) {
      return Math.round(((price - discountPrice) / price) * 100);
    }
    return 0;
  };

  return (
    <div className="product-page-container">
      {/* Lijevi filter panel */}
      <aside className="filter-section">
        <h3 className="filter-title">Filter Products</h3>

        <div className="filter-group">
          <label htmlFor="searchName">Search by Name:</label>
          <input
            id="searchName"
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="e.g. iPhone"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="selectedBrand">Brand:</label>
          <select
            id="selectedBrand"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
          >
            <option value="">-- All Brands --</option>
            {brands.map((b, index) => (
              <option key={index} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="searchDescription">Description:</label>
          <input
            id="searchDescription"
            type="text"
            value={searchDescription}
            onChange={(e) => setSearchDescription(e.target.value)}
            placeholder="Keywords..."
          />
        </div>

        <div className="filter-group">
          <label>Price Range (EUR):</label>
          <div className="price-range">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>
      </aside>

      {/* Desni prikaz proizvoda */}
      <main className="product-list-container">
        <h2 className="category-title">{categoryName}</h2>

        <div className="product-grid">
          {filteredProducts.map((prod) => {
            const discountPercentage = isDiscounted(prod)
              ? calculateDiscountPercentage(prod.price, prod.discountPrice)
              : 0;

            return (
              <div key={prod.id} className="product-card">
                <Link to={`/product/${prod.id}`} className="product-card-link">
                  {isDiscounted(prod) && discountPercentage > 0 && (
                    <div className="discount-badge">
                      <span>Save {discountPercentage}%</span>
                    </div>
                  )}

                  <img
                    src={`http://localhost:5199/${prod.imageUrl}`}
                    alt={prod.name}
                    className="product-image"
                  />
                  <h3>{prod.name}</h3>

                  <ul className="product-bullet-description">
                    {prod.description.split(",").map((part, idx) => (
                      <li key={idx}>{part.trim()}</li>
                    ))}
                  </ul>
                </Link>

                {/* Price + cart in one row, original price precrtana ako je discount */}
                {isDiscounted(prod) ? (
                  <>
                    <p className="hero-discounted-price">
                      {prod.discountPrice} EUR
                    </p>
                    <div className="price-cart-row">
                      <span className="hero-original-price">
                        {prod.price} EUR
                      </span>
                      <button
                        onClick={() => handleAddToCart(prod)}
                        className="add-to-cart-button"
                      >
                        <FontAwesomeIcon icon={faCartPlus} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="price-cart-row">
                    <span className="hero-product-price">{prod.price} EUR</span>
                    <button
                      onClick={() => handleAddToCart(prod)}
                      className="add-to-cart-button"
                    >
                      <FontAwesomeIcon icon={faCartPlus} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default ProductList;
