import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import "./Navbar.css";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <header className="navbar">
      <div className="navbar__inner container">
        <Link
          to="/"
          className="navbar__logo"
          onClick={closeMenu}
        >
          APPLIO<span>.</span>
        </Link>

        <nav
          className={`navbar__links ${
            menuOpen ? "is-open" : ""
          }`}
        >
          <NavLink
            to="/"
            className="navbar__link"
            onClick={closeMenu}
          >
            Home
          </NavLink>

          <NavLink
            to={isAuthenticated ? "/appliances" : "/login"}
            className="navbar__link"
            onClick={closeMenu}
          >
            Passport
          </NavLink>

          <NavLink
            to="/how-it-works"
            className="navbar__link"
            onClick={closeMenu}
          >
            How it works
          </NavLink>

          <div className="navbar__mobile-actions">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="navbar__login"
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>

                <button
                  type="button"
                  className="navbar__cta"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="navbar__login"
                  onClick={closeMenu}
                >
                  Sign in
                </Link>

                <Link
                  to="/register"
                  className="navbar__cta"
                  onClick={closeMenu}
                >
                  Get started
                  <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </>
            )}
          </div>
        </nav>

        <div className="navbar__actions">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="navbar__login"
              >
                Dashboard
              </Link>

              <button
                type="button"
                className="navbar__cta"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="navbar__login"
              >
                Sign in
              </Link>

              <Link
                to="/register"
                className="navbar__cta"
              >
                Get started
                <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="navbar__menu-button"
          onClick={() =>
            setMenuOpen((previous) => !previous)
          }
          aria-label={
            menuOpen ? "Close menu" : "Open menu"
          }
          aria-expanded={menuOpen}
        >
          <FontAwesomeIcon
            icon={menuOpen ? faXmark : faBars}
          />
        </button>
      </div>
    </header>
  );
};

export default Navbar;