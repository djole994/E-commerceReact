import React, { useState, useContext } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../../Components/Cart/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStore,
  faShoppingCart,
  faBars,
  faTimes,
  faSearch,
  faUserCircle,
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

  const location = useLocation(); 
  const navigate = useNavigate();

  const email = "info@shop.com";
  const phone = "+1 555 123 456";

  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  // Toggler za hamburger
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Pretraga
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/api/Product/Search?term=${encodeURIComponent(searchTerm)}`);
    setSearchTerm("");
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    navigate("/");
  };

  // Klik na ikonu korpe -> ako smo već na /cart, vrati se nazad, inače idi na /cart
  const handleCartClick = () => {
    if (location.pathname === "/cart") {
      navigate(-1); // vrati se na prethodnu stranicu
    } else {
      setMenuOpen(false);
      navigate("/cart");
    }
  };

  return (
    <div className="layout">
      {/* HEADER */}
      <header className="header">
        {/* TOP BAR */}
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

        {/* MAIN HEADER */}
        <div className="header-main">
          {/* Logo */}
          <div className="header-logo" onClick={() => navigate("/")}>
            <FontAwesomeIcon icon={faStore} size="2x" className="logo-icon" />
            <span className="logo-text">E-Shop</span>
          </div>

          <nav className={`main-nav ${menuOpen ? "open" : ""}`}>
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
          </nav>

          {/* Desni dio */}
          <div className="header-right-section">
            {/* Login/Logout */}
            <div className="user-auth">
              {token ? (
                <div className="logged-in">
                  <FontAwesomeIcon icon={faUserCircle} />
                  <span className="welcome-message">Hi, {username}</span>
                  <button onClick={handleLogout} className="logout-button">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="auth-links">
                  <Link to="/login" className="login-link">
                    Login
                  </Link>
                  <Link to="/register" className="register-link">
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Cart ikona
                - Umjesto <Link>, radimo onClick za toggle logiku */}
            <div className="cart-icon" onClick={handleCartClick}>
              <FontAwesomeIcon icon={faShoppingCart} size="lg" />
              {totalQuantity > 0 && (
                <span className="cart-badge">{totalQuantity}</span>
              )}
            </div>

            {/* Hamburger ikona za mobile */}
            <button className="menu-toggle" onClick={toggleMenu}>
              <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} size="lg" />
            </button>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="header-search">
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
        </div>

      </header>

      {/* Sadržaj */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Footer */}
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
