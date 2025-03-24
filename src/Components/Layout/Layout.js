import React, { useState, useContext } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../Components/Cart/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStore,
  faShoppingCart,
  faBars,
  faTimes,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import "./Layout.css";

const Layout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartItems } = useContext(CartContext);
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);


  const email = "info@shop.com";
  const phone = "+1 555 123 456";

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();


  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };


//NAPRAVITI KOMPONENTU ZA SEARCH
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/api/Product/Search?term=${encodeURIComponent(searchTerm)}`);

    setSearchTerm("");
  };

  return (
    <div className="layout">
      {/* ========== HEADER ========== */}
      <header className="header">
        {/* 1) Gornji red: email, telefon, društvene mreže */}
        <div className="header-top">
          <div className="contact-info">
            <span>{email}</span>
            <span>{phone}</span>
          </div>
          <div className="top-social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          </div>
        </div>

        {/* 2) Donji red: logo, navigacija, search i cart */}
        <div className="header-bottom">
          {/* Lijevo: Logo */}
          <div className="header-logo" onClick={() => navigate("/")}>
            <FontAwesomeIcon icon={faStore} size="2x" className="logo-icon" />
            <span className="logo-text">E-Shop</span>
          </div>

          {/* Navigacija (desktop), sakriveno na mobile */}
          <nav className="main-nav">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/shop">Shop</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </nav>

          {/* Search + Cart + Hamburger */}
          <div className="header-right-section">
            {/* Search bar (desktop) */}
            <form className="search-bar" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </form>

            {/* Cart ikona */}
            <div className="cart-icon">
              <Link to="/cart" style={{ position: "relative" }}>
                <FontAwesomeIcon icon={faShoppingCart} size="lg" />
                {totalQuantity > 0 && (
                  <span className="cart-badge">{totalQuantity}</span>
                )}
              </Link>
            </div>

            {/* Hamburger ikona (mobile) */}
            <button className="menu-toggle" onClick={toggleMenu}>
              <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} size="lg" />
            </button>
          </div>
        </div>

        {/* === Mobilni meni (nav + search + cart) === */}
        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          <ul>
            <li>
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/shop" onClick={() => setMenuOpen(false)}>
                Shop
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={() => setMenuOpen(false)}>
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => setMenuOpen(false)}>
                Contact
              </Link>
            </li>
          </ul>

          {/* Mobile search */}
          <form className="mobile-search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>

          <div className="mobile-social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          </div>

          {/* Cart i bedž */}
          <div className="mobile-cart-icon">
            <Link to="/cart" style={{ position: "relative" }} onClick={() => setMenuOpen(false)}>
              <FontAwesomeIcon icon={faShoppingCart} size="lg" />
              {totalQuantity > 0 && (
                <span className="cart-badge">{totalQuantity}</span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* GLAVNI SADRŽAJ */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-links">
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
          <p>&copy; {new Date().getFullYear()} E-Shop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
