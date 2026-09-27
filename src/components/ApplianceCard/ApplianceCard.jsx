import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBoxOpen,
} from "@fortawesome/free-solid-svg-icons";

import "./ApplianceCard.css";

const ApplianceCard = ({ appliance }) => {
  const getWarrantyStatus = () => {
    if (
      !appliance.purchaseDate ||
      appliance.warrantyMonths === undefined
    ) {
      return "Unknown";
    }

    const expiryDate = new Date(appliance.purchaseDate);

    expiryDate.setMonth(
      expiryDate.getMonth() +
        Number(appliance.warrantyMonths)
    );

    return expiryDate >= new Date()
      ? "Active"
      : "Expired";
  };

  const warrantyStatus = getWarrantyStatus();

  return (
    <article className="appliance-card">
      <div className="appliance-card__image">
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

      <div className="appliance-card__content">
        <div className="appliance-card__top">
          <span>
            {appliance.brand || "APPLIANCE"}
          </span>

          <small
            className={
              warrantyStatus === "Active"
                ? "is-active"
                : ""
            }
          >
            {warrantyStatus}
          </small>
        </div>

        <h3>
          {appliance.name ||
            appliance.title ||
            "Unnamed appliance"}
        </h3>

        <p>
          {appliance.model ||
            "Model not available"}
        </p>

        <div className="appliance-card__footer">
          <span>
            S/N{" "}
            {appliance.serialNumber ||
              "Not available"}
          </span>

          <Link
            to={`/appliances/${appliance._id}`}
          >
            View passport
            <FontAwesomeIcon
              icon={faArrowRight}
            />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ApplianceCard;