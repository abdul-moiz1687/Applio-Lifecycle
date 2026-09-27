import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faEye,
  faEyeSlash,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../../context/AuthContext";

import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const result = await register(
      formData.name,
      formData.email,
      formData.password
    );

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <main className="register-page">
      <section className="register-page__form-section">
        <div className="register-page__form-wrapper">
          <Link to="/" className="register-page__brand">
            APPLIO<span>.</span>
          </Link>

          <div className="register-page__heading">
            <p>START YOUR RECORD</p>

            <h1>
              Your appliances
              <span> deserve a history.</span>
            </h1>

            <div className="register-page__points">
              <div>
                <FontAwesomeIcon icon={faCircleCheck} />
                <span>Track every appliance</span>
              </div>

              <div>
                <FontAwesomeIcon icon={faCircleCheck} />
                <span>Keep warranties organized</span>
              </div>

              <div>
                <FontAwesomeIcon icon={faCircleCheck} />
                <span>Build a lifetime service record</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="register-form__error">
              {error}
            </div>
          )}

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="register-form__field">
              <label htmlFor="name">Full name</label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>

            <div className="register-form__field">
              <label htmlFor="email">Email address</label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="register-form__field">
              <label htmlFor="password">Password</label>

              <div className="register-form__password-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="register-form__password-toggle"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                  />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="register-form__submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create my passport"}

              {!loading && (
                <FontAwesomeIcon icon={faArrowRight} />
              )}
            </button>
          </form>

          <p className="register-page__login">
            Already have an account?
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </section>

      <section className="register-page__visual">
        <div className="register-page__grid" />

        <div className="register-page__orb register-page__orb--one" />
        <div className="register-page__orb register-page__orb--two" />

        <div className="register-page__visual-content">
          <p>01 / DIGITAL PASSPORT</p>

          <div className="register-passport">
            <div className="register-passport__header">
              <span>APPLIO</span>
              <span>EST. 2026</span>
            </div>

            <div className="register-passport__label">
              APPLIANCE IDENTITY
            </div>

            <h2>One home.</h2>
            <h2>Every record.</h2>

            <div className="register-passport__meta">
              <div>
                <span>WARRANTY</span>
                <strong>ACTIVE</strong>
              </div>

              <div>
                <span>SERVICE</span>
                <strong>05 RECORDS</strong>
              </div>
            </div>

            <div className="register-passport__bottom">
              <span>DIGITAL LIFECYCLE</span>
              <span>APPLIO.</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Register;
