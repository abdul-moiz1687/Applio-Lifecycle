import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

import ApplianceCard from "../../components/ApplianceCard/ApplianceCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBoxOpen,
  faImage,
  faPlus,
  faSearch,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import api from "../../services/api";

import "./Appliances.css";

const Appliances = () => {

  const pageRef = useRef(null);
  const headerRef = useRef(null);
  const toolbarRef = useRef(null);
  const gridRef = useRef(null);

  const [appliances, setAppliances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    serialNumber: "",
    purchaseDate: "",
    warrantyMonths: "",
    image: null,
  });

  const fetchAppliances = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("applioToken");

      const response = await api.get("/appliances", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          search,
          brand,
          page: 1,
          limit: 50,
        },
      });

      const data = response.data;

      const applianceList = Array.isArray(data)
        ? data
        : data.appliances || data.data || [];

      setAppliances(applianceList);
    } catch (error) {
      console.error("Appliances fetch error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load your appliances."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAppliances();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, brand]);

useLayoutEffect(() => {
  const context = gsap.context(() => {
    gsap.from(headerRef.current.children, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
    });

    gsap.from(toolbarRef.current, {
      y: 24,
      opacity: 0,
      duration: 0.7,
      delay: 0.15,
      ease: "power3.out",
    });
  }, pageRef);

  return () => context.revert();
}, []);

useLayoutEffect(() => {
  if (!gridRef.current || appliances.length === 0) {
    return;
  }

  const context = gsap.context(() => {
    gsap.from(gridRef.current.children, {
      y: 45,
      opacity: 0,
      duration: 0.7,
      stagger: 0.09,
      ease: "power3.out",
      clearProps: "transform",
      scrollTrigger: {
        trigger: gridRef.current,
        start: "top 82%",
        once: true,
      },
    });
  }, gridRef);

  return () => context.revert();
}, [appliances.length]);
  
  const availableBrands = useMemo(() => {
    const brands = appliances
      .map((appliance) => appliance.brand)
      .filter(Boolean);

    return [...new Set(brands)].sort();
  }, [appliances]);

  const handleFormChange = (event) => {
    const { name, value, files } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: name === "image" ? files?.[0] || null : value,
    }));

    setFormError("");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      brand: "",
      model: "",
      serialNumber: "",
      purchaseDate: "",
      warrantyMonths: "",
      image: null,
    });
    setFormError("");
  };

  const handleAddAppliance = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setFormError("");

    try {
      const token = localStorage.getItem("applioToken");

      const payload = new FormData();

      payload.append("name", formData.name);
      payload.append("brand", formData.brand);
      payload.append("model", formData.model);
      payload.append("serialNumber", formData.serialNumber);
      payload.append("purchaseDate", formData.purchaseDate);
      payload.append("warrantyMonths", formData.warrantyMonths);

      if (formData.image) {
        payload.append("image", formData.image);
      }

      await api.post("/appliances", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      resetForm();
      setShowForm(false);

      await fetchAppliances();
    } catch (error) {
      console.error("Add appliance error:", error);

      setFormError(
        error.response?.data?.message ||
          "Unable to add appliance."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const getWarrantyStatus = (appliance) => {
    if (!appliance.purchaseDate || !appliance.warrantyMonths) {
      return "Unknown";
    }

    const expiryDate = new Date(appliance.purchaseDate);

    expiryDate.setMonth(
      expiryDate.getMonth() + Number(appliance.warrantyMonths)
    );

    return expiryDate >= new Date() ? "Active" : "Expired";
  };

  return (
    <main  ref={pageRef} className="appliances-page">
      <section  ref={headerRef} className="appliances-header container">
        <div>
          <p className="appliances-eyebrow">
            DIGITAL APPLIANCE PASSPORT
          </p>

          <h1>
            Your appliances.
            <span>Every record in one place.</span>
          </h1>

          <p className="appliances-header__text">
            Manage your appliances, warranty information and
            lifecycle records from one place.
          </p>
        </div>

        <button
          type="button"
          className="appliances-add-button"
          onClick={() => {
            setShowForm((previous) => !previous);
            setFormError("");
          }}
        >
          <span>
            {showForm ? "Close" : "Add appliance"}
          </span>

          <FontAwesomeIcon
            icon={showForm ? faXmark : faPlus}
          />
        </button>
      </section>

      {showForm && (
        <section className="appliances-form-section container">
          <div className="appliances-form-card">
            <div className="appliances-form-card__heading">
              <div>
                <p>NEW RECORD</p>
                <h2>Add an appliance</h2>
              </div>
            </div>

            {formError && (
              <div className="appliances-form__error">
                {formError}
              </div>
            )}

            <form
              className="appliances-form"
              onSubmit={handleAddAppliance}
            >
              <div className="appliances-form__field">
                <label htmlFor="name">Appliance name</label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Air Conditioner"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="appliances-form__field">
                <label htmlFor="brand">Brand</label>

                <input
                  id="brand"
                  name="brand"
                  type="text"
                  placeholder="Dawlance"
                  value={formData.brand}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="appliances-form__field">
                <label htmlFor="model">Model</label>

                <input
                  id="model"
                  name="model"
                  type="text"
                  placeholder="30X"
                  value={formData.model}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="appliances-form__field">
                <label htmlFor="serialNumber">Serial number</label>

                <input
                  id="serialNumber"
                  name="serialNumber"
                  type="text"
                  placeholder="AC-001-MOIZ"
                  value={formData.serialNumber}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="appliances-form__field">
                <label htmlFor="purchaseDate">Purchase date</label>

                <input
                  id="purchaseDate"
                  name="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="appliances-form__field">
                <label htmlFor="warrantyMonths">
                  Warranty months
                </label>

                <input
                  id="warrantyMonths"
                  name="warrantyMonths"
                  type="number"
                  min="0"
                  placeholder="24"
                  value={formData.warrantyMonths}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="appliances-form__field appliances-form__field--full">
                <label htmlFor="image">Appliance image</label>

                <label
                  htmlFor="image"
                  className="appliances-image-upload"
                >
                  <FontAwesomeIcon icon={faImage} />

                  <span>
                    {formData.image
                      ? formData.image.name
                      : "Choose an image"}
                  </span>
                </label>

                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFormChange}
                  hidden
                />
              </div>

              <div className="appliances-form__actions">
                <button
                  type="button"
                  className="appliances-form__cancel"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="appliances-form__submit"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : "Save appliance"}

                  {!submitting && (
                    <FontAwesomeIcon icon={faArrowRight} />
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>
      )}
      <section  ref={toolbarRef} className="appliances-list-section container">
        <div  className="appliances-toolbar">
          <div className="appliances-search">
            <FontAwesomeIcon icon={faSearch} />

            <input
              type="search"
              placeholder="Search appliances..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            className="appliances-filter"
            value={brand}
            onChange={(event) => setBrand(event.target.value)}
          >
            <option value="">All brands</option>

            {availableBrands.map((brandName) => (
              <option key={brandName} value={brandName}>
                {brandName}
              </option>
            ))}
          </select>
        </div>

        <div className="appliances-section-heading">
          <div>
            <p>YOUR COLLECTION</p>
            <h2>
              {loading
                ? "Loading..."
                : `${appliances.length} appliance${
                    appliances.length === 1 ? "" : "s"
                  }`}
            </h2>
          </div>
        </div>

        {loading && (
          <div className="appliances-empty">
            <p>Loading your appliance records...</p>
          </div>
        )}

        {!loading && error && (
          <div className="appliances-empty appliances-empty--error">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && appliances.length === 0 && (
          <div className="appliances-empty">
            <div className="appliances-empty__icon">
              <FontAwesomeIcon icon={faBoxOpen} />
            </div>

            <h3>No appliances found.</h3>

            <p>
              Add your first appliance to start building its
              digital passport.
            </p>
          </div>
        )}

       {!loading && !error && appliances.length > 0 && (
  <div  ref={gridRef} className="appliances-grid">
    {appliances.map((appliance) => (
      <ApplianceCard
        key={appliance._id}
        appliance={appliance}
      />
    ))}
  </div>
)}
      </section>
    </main>
  );
};

export default Appliances;