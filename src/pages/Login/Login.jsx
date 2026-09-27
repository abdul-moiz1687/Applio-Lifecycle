import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faEye,
  faEyeSlash,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../../context/AuthContext";

import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
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

    const result = await login(
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
    <main className="login-page">
      <section className="login-page__visual">
        <div className="login-page__visual-glow login-page__visual-glow--one" />
        <div className="login-page__visual-glow login-page__visual-glow--two" />

        <Link to="/" className="login-page__brand">
          APPLIO<span>.</span>
        </Link>

        <div className="login-page__statement">
          <p className="login-page__label">
            YOUR APPLIANCE. YOUR HISTORY.
          </p>

          <h1>
            Keep every
            <span> moment </span>
            of your home in one place.
          </h1>

          <p className="login-page__description">
            From warranty dates to maintenance records, APPLIO keeps
            the full life of your appliances organized.
          </p>
        </div>

        <div className="login-page__passport-mini">
          <div className="login-page__passport-top">
            <span>APPLIO PASSPORT</span>
            <span>ACTIVE</span>
          </div>

          <div className="login-page__passport-main">
            <span className="login-page__passport-brand">
              HAIER
            </span>

            <strong>Lounge AC</strong>

            <small>HSU-18 · HSR-12345</small>
          </div>

          <div className="login-page__passport-bottom">
            <span>WARRANTY ACTIVE</span>
            <span>2027</span>
          </div>
        </div>
      </section>

      <section className="login-page__form-section">
        <div className="login-page__form-wrapper">
          <div className="login-page__mobile-brand">
            <Link to="/" className="login-page__brand">
              APPLIO<span>.</span>
            </Link>
          </div>

          <div className="login-page__heading">
            <p>WELCOME BACK</p>

            <h2>Sign in to APPLIO</h2>

            <span>
              Access your appliance passport and maintenance history.
            </span>
          </div>

          {error && (
            <div className="login-form__error">
              {error}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form__field">
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

            <div className="login-form__field">
              <div className="login-form__label-row">
                <label htmlFor="password">Password</label>

                <button
                  type="button"
                  className="login-form__forgot"
                >
                  Forgot password?
                </button>
              </div>

              <div className="login-form__password-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="login-form__password-toggle"
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
              className="login-form__submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}

              {!loading && (
                <FontAwesomeIcon icon={faArrowRight} />
              )}
            </button>
          </form>

          <div className="login-page__security">
            <FontAwesomeIcon icon={faShieldHalved} />

            <span>
              Your account and appliance records are protected.
            </span>
          </div>

          <p className="login-page__signup">
            Don&apos;t have an account?
            <Link to="/register">Create one</Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;