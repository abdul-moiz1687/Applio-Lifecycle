import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";

import "./Footer.css";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">
      <div className="footer__main container">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            APPLIO<span>.</span>
          </Link>

          <p>
            One appliance.
            <br />
            One digital history.
          </p>
        </div>

        <div className="footer__links">
          <div className="footer__column">
            <span>EXPLORE</span>

            <Link to="/">Home</Link>

            <Link to="/how-it-works">
              How it works
            </Link>

            <Link to="/appliances">
              My passport
            </Link>
          </div>

          <div className="footer__column">
            <span>ACCOUNT</span>

            <Link to="/login">
              Sign in
            </Link>

            <Link to="/register">
              Get started
            </Link>
          </div>
        </div>

        <div className="footer__note">
          <div className="footer__note-icon">
            <FontAwesomeIcon
              icon={faShieldHalved}
            />
          </div>

          <div>
            <span>PRIVATE BY DESIGN</span>

            <p>
              Your appliance records stay connected
              to your account.
            </p>
          </div>
        </div>
      </div>

      <div className="footer__bottom container">
        <span>
          © 2026 APPLIO. Digital appliance lifecycle.
        </span>

        <button
          type="button"
          onClick={scrollToTop}
          className="footer__top"
        >
          Back to top
          <FontAwesomeIcon
            icon={faArrowUpRightFromSquare}
          />
        </button>
      </div>
    </footer>
  );
};

export default Footer;