import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faBoxOpen,
  faCalendar,
  faCheck,
  faClock,
  faDownload,
  faFloppyDisk,
  faImage,
  faPen,
  faQrcode,
  faShieldHalved,
  faPlus,
  faScrewdriverWrench,
  faTag,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import api from "../../services/api";

import "./ApplianceDetails.css";

const ApplianceDetails = () => {
  const { id } = useParams();

  const [appliance, setAppliance] = useState(null);
  const [qrData, setQrData] = useState(null);

  const [services, setServices] = useState([]);
  const [serviceLoading, setServiceLoading] = useState(true);
  const [serviceSubmitting, setServiceSubmitting] = useState(false);
  const [serviceError, setServiceError] = useState("");
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [serviceUpdating, setServiceUpdating] = useState(false);

  const [serviceForm, setServiceForm] = useState({
    serviceDate: "",
    description: "",
    cost: "",
    technician: "",
  });

  const [loading, setLoading] = useState(true);
  const [qrLoading, setQrLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [editError, setEditError] = useState("");

  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    serialNumber: "",
    purchaseDate: "",
    warrantyMonths: "",
    image: null,
  });

  const loadApplianceData = async () => {
    try {
      const token = localStorage.getItem("applioToken");

      const response = await api.get(`/appliances/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data =
        response.data.appliance || response.data.data || response.data;

      setAppliance(data);

      setFormData({
        name: data.name || "",
        brand: data.brand || "",
        model: data.model || "",
        serialNumber: data.serialNumber || "",
        purchaseDate: data.purchaseDate
          ? new Date(data.purchaseDate).toISOString().split("T")[0]
          : "",
        warrantyMonths:
          data.warrantyMonths !== undefined ? data.warrantyMonths : "",
        image: null,
      });
    } catch (error) {
      console.error("Appliance details error:", error);

      setError(
        error.response?.data?.message || "Unable to load this appliance.",
      );
    } finally {
      setLoading(false);
    }
  };

  const loadServices = async () => {
    setServiceLoading(true);
    setServiceError("");

    try {
      const token = localStorage.getItem("applioToken");

      const response = await api.get(`/appliances/${id}/services`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      const serviceList = Array.isArray(data)
        ? data
        : data.serviceRecords || data.services || data.data || [];

      setServices(serviceList);
    } catch (error) {
      console.error("Service records error:", error);

      setServiceError(
        error.response?.data?.message || "Unable to load service history.",
      );
    } finally {
      setServiceLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadApplianceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function getWarrantyInfo() {
    if (!appliance?.purchaseDate || appliance?.warrantyMonths === undefined) {
      return {
        status: "Unknown",
        expiry: "Not available",
      };
    }

    const purchaseDate = new Date(appliance.purchaseDate);
    const expiryDate = new Date(purchaseDate);

    expiryDate.setMonth(
      expiryDate.getMonth() + Number(appliance.warrantyMonths),
    );

    const active = expiryDate >= new Date();

    return {
      status: active ? "Active" : "Expired",
      expiry: expiryDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };
  }

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleFormChange = (event) => {
    const { name, value, files } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: name === "image" ? files?.[0] || null : value,
    }));

    setEditError("");
  };

  const handleServiceFormChange = (event) => {
    const { name, value } = event.target;

    setServiceForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setServiceError("");
  };

  const handleAddService = async (event) => {
    event.preventDefault();

    setServiceSubmitting(true);
    setServiceError("");

    try {
      const token = localStorage.getItem("applioToken");

      await api.post(
        `/appliances/${id}/services`,
        {
          serviceDate: serviceForm.serviceDate,
          description: serviceForm.description,
          cost: Number(serviceForm.cost),
          technician: serviceForm.technician,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setServiceForm({
        serviceDate: "",
        description: "",
        cost: "",
        technician: "",
      });

      setShowServiceForm(false);

      await loadServices();
    } catch (error) {
      console.error("Add service error:", error);

      setServiceError(
        error.response?.data?.message || "Unable to add service record.",
      );
    } finally {
      setServiceSubmitting(false);
    }
  };

  const startEditService = (service) => {
    setEditingServiceId(service._id);

    setServiceForm({
      serviceDate: service.serviceDate
        ? new Date(service.serviceDate).toISOString().split("T")[0]
        : "",
      description: service.description || "",
      cost: service.cost ?? "",
      technician: service.technician || "",
    });

    setShowServiceForm(false);
    setServiceError("");
  };

  const cancelEditService = () => {
    setEditingServiceId(null);

    setServiceForm({
      serviceDate: "",
      description: "",
      cost: "",
      technician: "",
    });

    setServiceError("");
  };

  const handleUpdateService = async (event) => {
    event.preventDefault();

    setServiceUpdating(true);
    setServiceError("");

    try {
      const token = localStorage.getItem("applioToken");

      await api.put(
        `/appliances/${id}/services/${editingServiceId}`,
        {
          serviceDate: serviceForm.serviceDate,
          description: serviceForm.description,
          cost: Number(serviceForm.cost),
          technician: serviceForm.technician,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setEditingServiceId(null);

      setServiceForm({
        serviceDate: "",
        description: "",
        cost: "",
        technician: "",
      });

      await loadServices();
    } catch (error) {
      console.error("Update service error:", error);

      setServiceError(
        error.response?.data?.message || "Unable to update service record.",
      );
    } finally {
      setServiceUpdating(false);
    }
  };

  const handleDeleteService = async (serviceId) => {
    const confirmed = window.confirm("Delete this service record?");

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("applioToken");

      await api.delete(`/appliances/${id}/services/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await loadServices();
    } catch (error) {
      console.error("Delete service error:", error);

      setServiceError(
        error.response?.data?.message || "Unable to delete service record.",
      );
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    setSaving(true);
    setEditError("");

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

      const response = await api.put(`/appliances/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedAppliance =
        response.data.appliance || response.data.data || response.data;

      setAppliance(updatedAppliance);

      setFormData({
        name: updatedAppliance.name || "",
        brand: updatedAppliance.brand || "",
        model: updatedAppliance.model || "",
        serialNumber: updatedAppliance.serialNumber || "",
        purchaseDate: updatedAppliance.purchaseDate
          ? new Date(updatedAppliance.purchaseDate).toISOString().split("T")[0]
          : "",
        warrantyMonths:
          updatedAppliance.warrantyMonths !== undefined
            ? updatedAppliance.warrantyMonths
            : "",
        image: null,
      });

      setEditMode(false);
    } catch (error) {
      console.error("Update appliance error:", error);

      setEditError(
        error.response?.data?.message || "Unable to update this appliance.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete "${appliance?.name || "this appliance"}"?\n\nThis will remove the appliance and its stored image.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("applioToken");

      await api.delete(`/appliances/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      window.location.href = "/appliances";
    } catch (error) {
      console.error("Delete appliance error:", error);

      setError(
        error.response?.data?.message || "Unable to delete this appliance.",
      );
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditError("");

    setFormData({
      name: appliance?.name || "",
      brand: appliance?.brand || "",
      model: appliance?.model || "",
      serialNumber: appliance?.serialNumber || "",
      purchaseDate: appliance?.purchaseDate
        ? new Date(appliance.purchaseDate).toISOString().split("T")[0]
        : "",
      warrantyMonths:
        appliance?.warrantyMonths !== undefined ? appliance.warrantyMonths : "",
      image: null,
    });
  };

  const handleGenerateQR = async () => {
    setQrLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("applioToken");

      const response = await api.get(`/appliances/${id}/qr`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setQrData(response.data);
    } catch (error) {
      console.error("QR generation error:", error);

      setError(error.response?.data?.message || "Unable to generate QR code.");
    } finally {
      setQrLoading(false);
    }
  };

  const handleDownloadQR = () => {
    if (!qrData?.qrCode) {
      return;
    }

    const link = document.createElement("a");

    link.href = qrData.qrCode;
    link.download = `${appliance?.name || "applio-appliance"}-qr.png`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <main className="appliance-details-page">
        <div className="container">
          <div className="appliance-details-state">
            <p>Loading digital passport...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !appliance) {
    return (
      <main className="appliance-details-page">
        <div className="container">
          <div className="appliance-details-state appliance-details-state--error">
            <p>{error || "Appliance not found."}</p>

            <Link to="/appliances">
              <FontAwesomeIcon icon={faArrowLeft} />
              Back to appliances
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const warranty = getWarrantyInfo();

  const applianceName =
    appliance.name || appliance.title || "Unnamed appliance";

  return (
    <main className="appliance-details-page">
      <section className="appliance-details-header container">
        <div className="appliance-details-header__top">
          <Link to="/appliances" className="appliance-details-back">
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to appliances
          </Link>

          {!editMode && (
            <div className="appliance-details-actions">
              <button
                type="button"
                className="appliance-details-delete"
                onClick={handleDelete}
              >
                <FontAwesomeIcon icon={faTrash} />
                Delete
              </button>

              <button
                type="button"
                className="appliance-details-edit"
                onClick={() => {
                  setEditMode(true);
                  setEditError("");
                }}
              >
                <FontAwesomeIcon icon={faPen} />
                Edit appliance
              </button>
            </div>
          )}
        </div>

        <div className="appliance-details-label">
          <span>DIGITAL PASSPORT</span>
          <span>APPLIO / {id.slice(-6).toUpperCase()}</span>
        </div>
      </section>
      {editMode ? (
        <section className="appliance-edit-section container">
          <div className="appliance-edit-card">
            <div className="appliance-edit-card__heading">
              <p>UPDATE RECORD</p>
              <h1>Edit appliance</h1>
              <span>Update the details of your appliance passport.</span>
            </div>

            {editError && (
              <div className="appliance-edit__error">{editError}</div>
            )}

            <form className="appliance-edit-form" onSubmit={handleUpdate}>
              <div className="appliance-edit-form__field">
                <label htmlFor="edit-name">Appliance name</label>

                <input
                  id="edit-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="appliance-edit-form__field">
                <label htmlFor="edit-brand">Brand</label>

                <input
                  id="edit-brand"
                  name="brand"
                  type="text"
                  value={formData.brand}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="appliance-edit-form__field">
                <label htmlFor="edit-model">Model</label>

                <input
                  id="edit-model"
                  name="model"
                  type="text"
                  value={formData.model}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="appliance-edit-form__field">
                <label htmlFor="edit-serialNumber">Serial number</label>

                <input
                  id="edit-serialNumber"
                  name="serialNumber"
                  type="text"
                  value={formData.serialNumber}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="appliance-edit-form__field">
                <label htmlFor="edit-purchaseDate">Purchase date</label>

                <input
                  id="edit-purchaseDate"
                  name="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="appliance-edit-form__field">
                <label htmlFor="edit-warrantyMonths">Warranty months</label>

                <input
                  id="edit-warrantyMonths"
                  name="warrantyMonths"
                  type="number"
                  min="0"
                  value={formData.warrantyMonths}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="appliance-edit-form__field appliance-edit-form__field--full">
                <label htmlFor="edit-image">Replace image</label>

                <label htmlFor="edit-image" className="appliance-edit-image">
                  <FontAwesomeIcon icon={faImage} />

                  <span>
                    {formData.image
                      ? formData.image.name
                      : "Choose a new image (optional)"}
                  </span>
                </label>

                <input
                  id="edit-image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFormChange}
                  hidden
                />
              </div>

              <div className="appliance-edit-form__actions">
                <button
                  type="button"
                  className="appliance-edit-form__cancel"
                  onClick={handleCancelEdit}
                >
                  <FontAwesomeIcon icon={faXmark} />
                  Cancel
                </button>

                <button
                  type="submit"
                  className="appliance-edit-form__save"
                  disabled={saving}
                >
                  <FontAwesomeIcon icon={faFloppyDisk} />

                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </section>
      ) : (
        <>
          <section className="appliance-passport container">
            <div className="appliance-passport__visual">
              <div className="appliance-passport__image">
                {appliance.image?.url ? (
                  <img
                    src={appliance.image.url}
                    alt={appliance.image.alt || applianceName}
                  />
                ) : (
                  <FontAwesomeIcon icon={faBoxOpen} />
                )}
              </div>

              <div className="appliance-passport__visual-meta">
                <span>APPLIO</span>
                <span>EST. 2026</span>
              </div>
            </div>

            <div className="appliance-passport__main">
              <div className="appliance-passport__intro">
                <p>{appliance.brand || "APPLIANCE"}</p>

                <h1>{applianceName}</h1>

                <span>{appliance.model || "Model not available"}</span>
              </div>

              <div className="appliance-passport__status">
                <FontAwesomeIcon icon={faShieldHalved} />

                <div>
                  <span>WARRANTY STATUS</span>

                  <strong
                    className={warranty.status === "Active" ? "is-active" : ""}
                  >
                    {warranty.status}
                  </strong>
                </div>
              </div>
            </div>
          </section>

          <section className="appliance-details-grid container">
            <article className="appliance-info-card">
              <div className="appliance-info-card__heading">
                <FontAwesomeIcon icon={faTag} />

                <div>
                  <span>IDENTITY</span>
                  <h2>Appliance details</h2>
                </div>
              </div>

              <div className="appliance-info-list">
                <div>
                  <span>Brand</span>
                  <strong>{appliance.brand || "Not available"}</strong>
                </div>

                <div>
                  <span>Model</span>
                  <strong>{appliance.model || "Not available"}</strong>
                </div>

                <div>
                  <span>Serial number</span>
                  <strong>{appliance.serialNumber || "Not available"}</strong>
                </div>

                <div>
                  <span>Purchase date</span>
                  <strong>{formatDate(appliance.purchaseDate)}</strong>
                </div>
              </div>
            </article>

            <article className="appliance-info-card">
              <div className="appliance-info-card__heading">
                <FontAwesomeIcon icon={faCalendar} />

                <div>
                  <span>WARRANTY</span>
                  <h2>Coverage details</h2>
                </div>
              </div>

              <div className="appliance-warranty">
                <div className="appliance-warranty__status">
                  <FontAwesomeIcon icon={faCheck} />

                  <div>
                    <span>Current status</span>
                    <strong>{warranty.status}</strong>
                  </div>
                </div>

                <div className="appliance-warranty__row">
                  <span>Coverage</span>
                  <strong>{appliance.warrantyMonths || 0} months</strong>
                </div>

                <div className="appliance-warranty__row">
                  <span>Expiry date</span>
                  <strong>{warranty.expiry}</strong>
                </div>
              </div>
            </article>

            <article className="appliance-info-card appliance-info-card--qr">
              <div className="appliance-info-card__heading">
                <FontAwesomeIcon icon={faQrcode} />

                <div>
                  <span>IDENTITY LINK</span>
                  <h2>QR passport</h2>
                </div>
              </div>

              {!qrData ? (
                <div className="appliance-qr-empty">
                  <div className="appliance-qr-placeholder">
                    <FontAwesomeIcon icon={faQrcode} />
                  </div>

                  <p>
                    Generate a QR code for this appliance's digital passport.
                  </p>

                  <button
                    type="button"
                    onClick={handleGenerateQR}
                    disabled={qrLoading}
                  >
                    {qrLoading ? "Generating..." : "Generate QR"}
                  </button>
                </div>
              ) : (
                <div className="appliance-qr-result">
                  <img src={qrData.qrCode} alt="Appliance passport QR code" />

                  <div>
                    <p>Scan this code to open the appliance passport.</p>

                    <button type="button" onClick={handleDownloadQR}>
                      <FontAwesomeIcon icon={faDownload} />
                      Download QR
                    </button>
                  </div>
                </div>
              )}
            </article>

            <article className="appliance-info-card">
              <div className="appliance-info-card__heading">
                <FontAwesomeIcon icon={faClock} />

                <div>
                  <span>LIFECYCLE</span>
                  <h2>Record overview</h2>
                </div>
              </div>

              <div className="appliance-lifecycle">
                <div>
                  <span>Service records</span>

                  <strong>
                    {appliance.serviceRecords?.length ||
                      appliance.services?.length ||
                      0}
                  </strong>
                </div>

                <div>
                  <span>Passport created</span>

                  <strong>{formatDate(appliance.createdAt)}</strong>
                </div>
              </div>
            </article>
          </section>

          <section className="service-history-section container">
            <div className="service-history-header">
              <div>
                <p>SERVICE HISTORY</p>
                <h2>The life of this appliance.</h2>
              </div>

              <button
                type="button"
                className="service-history-add"
                onClick={() => {
                  setShowServiceForm((previous) => !previous);
                  setServiceError("");
                }}
              >
                <FontAwesomeIcon icon={showServiceForm ? faXmark : faPlus} />

                {showServiceForm ? "Close" : "Add service"}
              </button>
            </div>

            {(showServiceForm || editingServiceId) && (
              <div className="service-form-card">
                {serviceError && (
                  <div className="service-form__error">{serviceError}</div>
                )}

                <form
                  className="service-form"
                  onSubmit={
                    editingServiceId ? handleUpdateService : handleAddService
                  }
                >
                  <div className="service-form__field">
                    <label htmlFor="serviceDate">Service date</label>

                    <input
                      id="serviceDate"
                      name="serviceDate"
                      type="date"
                      value={serviceForm.serviceDate}
                      onChange={handleServiceFormChange}
                      required
                    />
                  </div>

                  <div className="service-form__field">
                    <label htmlFor="technician">Technician</label>

                    <input
                      id="technician"
                      name="technician"
                      type="text"
                      placeholder="Ali AC Services"
                      value={serviceForm.technician}
                      onChange={handleServiceFormChange}
                      required
                    />
                  </div>

                  <div className="service-form__field">
                    <label htmlFor="cost">Cost (PKR)</label>

                    <input
                      id="cost"
                      name="cost"
                      type="number"
                      min="1"
                      placeholder="2500"
                      value={serviceForm.cost}
                      onChange={handleServiceFormChange}
                      required
                    />
                  </div>

                  <div className="service-form__field service-form__field--full">
                    <label htmlFor="description">Service description</label>

                    <textarea
                      id="description"
                      name="description"
                      rows="4"
                      placeholder="Routine maintenance, gas refill, capacitor replacement..."
                      value={serviceForm.description}
                      onChange={handleServiceFormChange}
                      required
                    />
                  </div>

                  <div className="service-form__actions">
                    <button
                      type="submit"
                      className="service-form__submit"
                      disabled={
                        editingServiceId ? serviceUpdating : serviceSubmitting
                      }
                    >
                      <FontAwesomeIcon
                        icon={editingServiceId ? faFloppyDisk : faPlus}
                      />

                      {editingServiceId
                        ? serviceUpdating
                          ? "Updating..."
                          : "Update service"
                        : serviceSubmitting
                          ? "Saving..."
                          : "Save service"}
                    </button>

                    {editingServiceId && (
                      <button
                        type="button"
                        className="service-form__cancel"
                        onClick={cancelEditService}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {serviceLoading && (
              <div className="service-history-empty">
                <p>Loading service history...</p>
              </div>
            )}

            {!serviceLoading && !serviceError && services.length === 0 && (
              <div className="service-history-empty">
                <div className="service-history-empty__icon">
                  <FontAwesomeIcon icon={faScrewdriverWrench} />
                </div>

                <h3>No service records yet.</h3>

                <p>
                  Add the first maintenance or repair record for this appliance.
                </p>
              </div>
            )}

            {!serviceLoading && services.length > 0 && (
              <div className="service-history-list">
                {services.map((service) => (
                  <article className="service-history-item" key={service._id}>
                    <div className="service-history-item__icon">
                      <FontAwesomeIcon icon={faScrewdriverWrench} />
                    </div>

                    <div className="service-history-item__content">
                      <div className="service-history-item__top">
                        <div>
                          <span>
                            {service.serviceDate
                              ? new Date(
                                  service.serviceDate,
                                ).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "Date unavailable"}
                          </span>

                          <h3>{service.description || "Service record"}</h3>
                        </div>

                        <div className="service-history-item__actions">
                          <button
                            type="button"
                            onClick={() => startEditService(service)}
                            aria-label="Edit service record"
                          >
                            <FontAwesomeIcon icon={faPen} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteService(service._id)}
                            aria-label="Delete service record"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>

                        <strong>
                          PKR {Number(service.cost || 0).toLocaleString()}
                        </strong>
                      </div>

                      <p>Technician: {service.technician || "Not specified"}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
};

export default ApplianceDetails;
