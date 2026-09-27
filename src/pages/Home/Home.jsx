import { useEffect, useRef } from "react";
import Marquee from "../../components/Marquee/Marquee";
import { useAuth } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import gsap from "gsap";

import "./Home.css";

const Home = () => {
    const { isAuthenticated } = useAuth();
  const heroRef = useRef(null);

  useEffect(() => {
    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .from(".hero__eyebrow", {
          y: 20,
          opacity: 0,
          duration: 0.7,
        })
        .from(
          ".hero__title-line",
          {
            y: 90,
            opacity: 0,
            duration: 0.9,
            stagger: 0.12,
          },
          "-=0.4"
        )
        .from(
          ".hero__description",
          {
            y: 25,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.5"
        )
        .from(
          ".hero__actions",
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.4"
        )
        .from(
          ".hero__visual",
          {
            scale: 0.85,
            opacity: 0,
            duration: 1,
          },
          "-=0.6"
        );
    }, heroRef);

    return () => context.revert();
  }, []);

  return (
    <div>
    <section className="hero" ref={heroRef}>
      <div className="hero__glow hero__glow--one" />
      <div className="hero__glow hero__glow--two" />

      <div className="container hero__container">
        <div className="hero__content">
          <div className="hero__eyebrow">
            <span className="hero__eyebrow-dot" />
            Digital appliance lifecycle
          </div>

          <h1 className="hero__title">
            <span className="hero__title-line">Your home.</span>
            <span className="hero__title-line">Every appliance.</span>
            <span className="hero__title-line hero__title-line--accent">
              One history.
            </span>
          </h1>

          <p className="hero__description">
            APPLIO keeps your appliances, warranties, service records and
            maintenance costs in one simple digital passport.
          </p>

          <div className="hero__actions">
            <Link to={isAuthenticated ? "/appliances" : "/register"} className="hero__primary-button">
              Build your passport
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>

<Link
  to="/how-it-works"
  className="hero__secondary-button"
>
  Explore APPLIO
</Link>
          </div>

          <div className="hero__trust">
            <FontAwesomeIcon icon={faShieldHalved} />
            <span>Your appliance data, organized in one place.</span>
          </div>
        </div>

        <div className="hero__visual">
          <div className="passport-card">
            <div className="passport-card__top">
              <span>APPLIO PASSPORT</span>
              <span>01 / 01</span>
            </div>

            <div className="passport-card__brand">
              HAIER
            </div>

            <h2 className="passport-card__name">
              Lounge AC
            </h2>

            <p className="passport-card__serial">
              HSU-18 · HSR-12345
            </p>

            <div className="passport-card__status">
              <span />
              WARRANTY ACTIVE
            </div>

            <div className="passport-card__stats">
              <div>
                <span>Purchased</span>
                <strong>14 Aug 2024</strong>
              </div>

              <div>
                <span>Services</span>
                <strong>05 records</strong>
              </div>

              <div>
                <span>Spent</span>
                <strong>PKR 18,700</strong>
              </div>
            </div>

            <div className="passport-card__line" />

            <div className="passport-card__footer">
              <span>Digital appliance record</span>
              <span>APPLIO.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
     <Marquee />
     </div>

  );
};

export default Home;