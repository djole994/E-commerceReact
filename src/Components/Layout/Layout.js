import React, { useState } from "react";
import CategoryList from "../Category/CategoryList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore, faShoppingCart, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { Outlet } from "react-router-dom";
import "./Layout.css";

const Layout = () => {
  // State za kontrolu mobilnog menijaa
  const [menuOpen, setMenuOpen] = useState(false);

  // Otvaranje/zatvaranje mobilnog menija
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="layout">
      {/* HEADER */}
      <header className="header">
        <div className="header-content">
          {/* Lijevo: Logo */}
          <div className="header-left" onClick={() => (window.location.href = "/")}>
            <FontAwesomeIcon icon={faStore} size="2x" className="logo-icon" />
            <span className="logo-text">E-Shop</span>
          </div>

          {/* Centar: Navigacija (vidljivo samo na desktopu) */}
          <nav className="header-center">
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/shop">Shop</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </nav>

          {/* Desno: Društvene mreže + korpaA (vidljivo samo na desktopu) */}
          <div className="header-right">
            <div className="social-icons">
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
            <div className="cart-icon">
              <a href="/cart">
                <FontAwesomeIcon icon={faShoppingCart} size="lg" />
              </a>
            </div>
          </div>

          {/* Hamburger / X (vidljiv samo na mobilnom) */}
          <button className="menu-toggle" onClick={toggleMenu}>
            <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} size="lg" />
          </button>
        </div>

        {/* MOBILNI MENI: Sve u jednom containeru (nav + social + cart) */}
        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/shop">Shop</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>

          <div className="social-icons">
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

          <div className="cart-icon">
            <a href="/cart">
              <FontAwesomeIcon icon={faShoppingCart} size="lg" />
            </a>
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
            <a href="/about">About Us</a>
            <a href="/contact">Contact</a>
            <a href="/faq">FAQ</a>
            <a href="/terms">Terms of Service</a>
            <a href="/privacy">Privacy Policy</a>
          </div>
          <p>&copy; {new Date().getFullYear()} E-Shop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
