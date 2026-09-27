import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBoxOpen,
  faCircleCheck,
  faPlus,
  faShieldHalved,
  faScrewdriverWrench,
} from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

import "./Dashboard.css";

const Dashboard = () => {
const heroRef = useRef(null);
const statsRef = useRef(null);
const contentRef = useRef(null);


  const { user } = useAuth();

  const [appliances, setAppliances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

useEffect(() => {
  const ctx = gsap.context(() => {
    const timeline = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
    });

    timeline
      .from(heroRef.current.children, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
      })
      .from(
        statsRef.current.children,
        {
          y: 24,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
        },
        "-=0.35"
      )
      .from(
        contentRef.current,
        {
          y: 24,
          opacity: 0,
          duration: 0.7,
        },
        "-=0.3"
      );
  });

  return () => ctx.revert();
}, []);

  useEffect(() => {
    const fetchAppliances = async () => {
      try {
        const token = localStorage.getItem("applioToken");

        const response = await api.get("/appliances", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;

       const applianceList = Array.isArray(data)
  ? data
  : data.appliances || data.data || [];


const appliancesWithServices = await Promise.all(
  applianceList.map(async (appliance) => {
    try {
      const serviceResponse = await api.get(
        `/appliances/${appliance._id}/services`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const serviceData = serviceResponse.data;

      const serviceList = Array.isArray(serviceData)
        ? serviceData
        : serviceData.services ||
          serviceData.serviceRecords ||
          serviceData.data ||
          [];

      return {
        ...appliance,
        serviceRecords: serviceList,
      };
    } catch (serviceError) {
      console.error(
        `Services load error for ${appliance._id}:`,
        serviceError
      );

      return {
        ...appliance,
        serviceRecords: [],
      };
    }
  })
);

setAppliances(appliancesWithServices);
      } catch (error) {
        console.error("Dashboard appliances error:", error);
        setError(
          error.response?.data?.message || "Unable to load your appliances."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppliances();
  }, []);

  const getWarrantyStatus = (appliance) => {
    if (!appliance.purchaseDate || !appliance.warrantyMonths) {
      return "Unknown";
    }

    const expiryDate = new Date(appliance.purchaseDate);
    expiryDate.setMonth(
      expiryDate.getMonth() + appliance.warrantyMonths
    );

    return expiryDate >= new Date() ? "Active" : "Expired";
  };

  const activeWarranties = appliances.filter(
    (appliance) => getWarrantyStatus(appliance) === "Active"
  ).length;

  const totalServices = appliances.reduce((total, appliance) => {
    const records =
      appliance.serviceRecords ||
      appliance.services ||
      [];

    return total + (Array.isArray(records) ? records.length : 0);
  }, 0);

  const recentAppliances = appliances.slice(0, 3);

  return (
    <main className="dashboard-page">
      <section  ref={heroRef} className="dashboard-hero container">
        <div className="dashboard-hero__content">
          <p className="dashboard-eyebrow">YOUR APPLIO SPACE</p>

          <h1>
            Welcome back,
            <span>{user?.name || "there"}.</span>
          </h1>

          <p className="dashboard-hero__text">
            Keep your appliances, warranties and service history
            organized in one place.
          </p>
        </div>

        <Link to="/appliances" className="dashboard-hero__button">
          <span>Add appliance</span>
          <FontAwesomeIcon icon={faPlus} />
        </Link>
      </section>

      <section  ref={statsRef} className="dashboard-stats container">
        <article className="dashboard-stat">
          <div className="dashboard-stat__icon">
            <FontAwesomeIcon icon={faBoxOpen} />
          </div>

          <div>
            <span>Total appliances</span>
            <strong>{appliances.length}</strong>
          </div>
        </article>

        <article className="dashboard-stat">
          <div className="dashboard-stat__icon">
            <FontAwesomeIcon icon={faShieldHalved} />
          </div>

          <div>
            <span>Active warranties</span>
            <strong>{activeWarranties}</strong>
          </div>
        </article>

        <article className="dashboard-stat">
          <div className="dashboard-stat__icon">
            <FontAwesomeIcon icon={faScrewdriverWrench} />
          </div>

          <div>
            <span>Service records</span>
            <strong>{totalServices}</strong>
          </div>
        </article>
      </section>

      <section  ref={contentRef} className="dashboard-content container">
        <div className="dashboard-section-heading">
          <div>
            <p>YOUR APPLIANCES</p>
            <h2>Recent records</h2>
          </div>

          <Link to="/appliances">
            View all
            <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>

        {loading && (
          <div className="dashboard-empty">
            <p>Loading your appliances...</p>
          </div>
        )}

        {!loading && error && (
          <div className="dashboard-empty dashboard-empty--error">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && recentAppliances.length === 0 && (
          <div className="dashboard-empty">
            <div className="dashboard-empty__icon">
              <FontAwesomeIcon icon={faBoxOpen} />
            </div>

            <h3>Your appliance passport starts here.</h3>

            <p>
              Add your first appliance and start building its
              digital history.
            </p>

            <Link to="/appliances" className="dashboard-empty__button">
              Add your first appliance
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>
        )}

        {!loading && !error && recentAppliances.length > 0 && (
          <div className="dashboard-appliances">
            {recentAppliances.map((appliance) => (
              <article
                className="dashboard-appliance"
                key={appliance._id}
              >
                <div className="dashboard-appliance__image">
                  {appliance.image?.url ? (
                    <img
                      src={appliance.image.url}
                      alt={appliance.image.alt || appliance.name}
                    />
                  ) : (
                    <FontAwesomeIcon icon={faBoxOpen} />
                  )}
                </div>

                <div className="dashboard-appliance__info">
                  <span>{appliance.brand || "APPLIANCE"}</span>

                  <h3>
                    {appliance.name || appliance.title || "Unnamed appliance"}
                  </h3>

                  <p>
                    {appliance.model || "Model not available"}
                  </p>
                </div>

                <div className="dashboard-appliance__status">
                  <FontAwesomeIcon icon={faCircleCheck} />

                  <span>
                    {getWarrantyStatus(appliance)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Dashboard;