import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import {
  faArrowLeft,
  faBoxOpen,
  faCalendar,
  faCheck,
  faClock,
  faShieldHalved,
  faScrewdriverWrench,
  faTag,
} from "@fortawesome/free-solid-svg-icons";

import api from "../../services/api";

import "./PublicPassport.css";

gsap.registerPlugin(ScrollTrigger);

const PublicPassport = () => {

const pageRef = useRef(null);
const topRef = useRef(null);
const heroRef = useRef(null);
const statsRef = useRef(null);
const detailsRef = useRef(null);
const serviceRef = useRef(null);

  const { id } = useParams();

  const [appliance, setAppliance] = useState(null);
  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPublicPassport = async () => {
      try {
        const response = await api.get(
          `/appliances/public/${id}`
        );

        const data = response.data;

        setAppliance(data.appliance);
        setServices(
          Array.isArray(data.services)
            ? data.services
            : []
        );
      } catch (error) {
        console.error(
          "Public passport error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to load this passport."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPublicPassport();
  }, [id]);

  useLayoutEffect(() => {
  if (!appliance) {
    return;
  }

  const context = gsap.context(() => {
    const timeline = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
    });

    timeline
      .from(topRef.current.children, {
        y: 15,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
      })
      .from(
        heroRef.current.children,
        {
          y: 35,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
        },
        "-=0.2"
      )
      .from(
        statsRef.current.children,
        {
          y: 24,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
        },
        "-=0.35"
      );

    gsap.from(detailsRef.current.children, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: detailsRef.current,
        start: "top 82%",
        once: true,
      },
    });

    gsap.from(serviceRef.current, {
      y: 45,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: serviceRef.current,
        start: "top 82%",
        once: true,
      },
    });
  }, pageRef);

  return () => context.revert();
}, [appliance]);

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getTotalSpent = () => {
    return services.reduce(
      (total, service) =>
        total + Number(service.cost || 0),
      0
    );
  };

  if (loading) {
    return (
      <main  ref={pageRef} className="public-passport-page">
        <div className="container">
          <div className="public-passport-state">
            <p>Loading public passport...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !appliance) {
    return (
      <main  ref={pageRef} className="public-passport-page">
        <div className="container">
          <div className="public-passport-state public-passport-state--error">
            <p>
              {error || "Passport not found."}
            </p>

            <Link to="/">
              <FontAwesomeIcon icon={faArrowLeft} />
              Back to APPLIO
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main  ref={pageRef} className="public-passport-page">
      <section  ref={topRef} className="public-passport-top container">
        <Link to="/" className="public-passport-brand">
          APPLIO<span>.</span>
        </Link>

        <span>PUBLIC DIGITAL PASSPORT</span>
      </section>

      <section  ref={heroRef} className="public-passport-hero container">
        <div className="public-passport-hero__image">
          {appliance.image?.url ? (
            <img
              src={appliance.image.url}
              alt={
                appliance.image.alt ||
                appliance.name ||
                "Appliance"
              }
            />
          ) : (
            <FontAwesomeIcon icon={faBoxOpen} />
          )}
        </div>

        <div className="public-passport-hero__content">
          <p>
            {appliance.brand || "APPLIANCE"}
          </p>

          <h1>
            {appliance.name ||
              "Appliance Passport"}
          </h1>

          <span>
            {appliance.model ||
              "Model not available"}
          </span>

          <div className="public-passport-status">
            <FontAwesomeIcon
              icon={faShieldHalved}
            />

            <div>
              <span>WARRANTY</span>

              <strong
                className={
                  appliance.warrantyStatus ===
                  "Active"
                    ? "is-active"
                    : ""
                }
              >
                {appliance.warrantyStatus ||
                  "Unknown"}
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section  ref={statsRef} className="public-passport-stats container">
        <article>
          <span>PURCHASED</span>
          <strong>
            {formatDate(appliance.purchaseDate)}
          </strong>
        </article>

        <article>
          <span>WARRANTY EXPIRY</span>
          <strong>
            {formatDate(
              appliance.warrantyExpiry
            )}
          </strong>
        </article>

        <article>
          <span>SERVICE RECORDS</span>
          <strong>{services.length}</strong>
        </article>

        <article>
          <span>TOTAL SPENT</span>
          <strong>
            PKR {getTotalSpent().toLocaleString()}
          </strong>
        </article>
      </section>

      <section  ref={detailsRef} className="public-passport-details container">
        <article className="public-passport-card">
          <div className="public-passport-card__heading">
            <FontAwesomeIcon icon={faTag} />

            <div>
              <span>IDENTITY</span>
              <h2>Appliance details</h2>
            </div>
          </div>

          <div className="public-passport-info">
            <div>
              <span>Brand</span>
              <strong>
                {appliance.brand ||
                  "Not available"}
              </strong>
            </div>

            <div>
              <span>Model</span>
              <strong>
                {appliance.model ||
                  "Not available"}
              </strong>
            </div>

            <div>
              <span>Serial number</span>
              <strong>
                {appliance.serialNumber ||
                  "Not available"}
              </strong>
            </div>

            <div>
              <span>Purchase date</span>
              <strong>
                {formatDate(
                  appliance.purchaseDate
                )}
              </strong>
            </div>
          </div>
        </article>

        <article className="public-passport-card">
          <div className="public-passport-card__heading">
            <FontAwesomeIcon
              icon={faShieldHalved}
            />

            <div>
              <span>WARRANTY</span>
              <h2>Coverage</h2>
            </div>
          </div>

          <div className="public-passport-warranty">
            <div className="public-passport-warranty__status">
              <FontAwesomeIcon icon={faCheck} />

              <div>
                <span>Current status</span>

                <strong
                  className={
                    appliance.warrantyStatus ===
                    "Active"
                      ? "is-active"
                      : ""
                  }
                >
                  {appliance.warrantyStatus ||
                    "Unknown"}
                </strong>
              </div>
            </div>

            <div>
              <span>Coverage</span>
              <strong>
                {appliance.warrantyMonths || 0} months
              </strong>
            </div>

            <div>
              <span>Expiry</span>
              <strong>
                {formatDate(
                  appliance.warrantyExpiry
                )}
              </strong>
            </div>
          </div>
        </article>
      </section>

      <section   ref={serviceRef} className="public-service-section container">
        <div className="public-service-header">
          <div>
            <p>SERVICE HISTORY</p>
            <h2>Lifecycle record.</h2>
          </div>

          <span>
            {services.length}{" "}
            {services.length === 1
              ? "record"
              : "records"}
          </span>
        </div>

        {services.length === 0 ? (
          <div className="public-service-empty">
            <FontAwesomeIcon
              icon={faScrewdriverWrench}
            />

            <p>
              No service records have been added
              yet.
            </p>
          </div>
        ) : (
          <div className="public-service-list">
            {services.map((service) => (
              <article
                className="public-service-item"
                key={service._id}
              >
                <div className="public-service-item__icon">
                  <FontAwesomeIcon
                    icon={faScrewdriverWrench}
                  />
                </div>

                <div className="public-service-item__content">
                  <div>
                    <span>
                      {formatDate(
                        service.serviceDate
                      )}
                    </span>

                    <h3>
                      {service.description ||
                        "Service record"}
                    </h3>
                  </div>

                  <strong>
                    PKR{" "}
                    {Number(
                      service.cost || 0
                    ).toLocaleString()}
                  </strong>

                  <p>
                    Technician:{" "}
                    {service.technician ||
                      "Not specified"}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="public-passport-footer container">
        <div>
          <span>APPLIO.</span>
          <p>
            One appliance. One digital history.
          </p>
        </div>

        <div>
          <span>IDENTITY</span>
          <strong>
            {id.slice(-8).toUpperCase()}
          </strong>
        </div>

        <div>
          <FontAwesomeIcon icon={faCalendar} />
          <span>
            Passport created{" "}
            {formatDate(appliance.createdAt)}
          </span>
        </div>

        <div>
          <FontAwesomeIcon icon={faClock} />
          <span>
            Public record • Read only
          </span>
        </div>
      </footer>
    </main>
  );
};

export default PublicPassport;