import { Link } from "react-router-dom";
import { useLayoutEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  faArrowRight,
  faBoxOpen,
  faQrcode,
  faShieldHalved,
  faScrewdriverWrench,
} from "@fortawesome/free-solid-svg-icons";


import "./HowItWorks.css";

gsap.registerPlugin(ScrollTrigger);

const HowItWorks = () => {
  const pageRef = useRef(null);
const heroRef = useRef(null);
const stepsRef = useRef(null);
const featureRef = useRef(null);

  const steps = [
    {
      number: "01",
      icon: faBoxOpen,
      title: "Add your appliance",
      text: "Create a digital record with the appliance name, brand, model, serial number, purchase date and image.",
    },
    {
      number: "02",
      icon: faShieldHalved,
      title: "Track its warranty",
      text: "Keep warranty coverage and expiry information connected to the appliance, so it stays easy to check.",
    },
    {
      number: "03",
      icon: faScrewdriverWrench,
      title: "Build the service history",
      text: "Record maintenance work, technicians, dates and costs to create a complete lifecycle history.",
    },
    {
      number: "04",
      icon: faQrcode,
      title: "Access it anytime",
      text: "Generate a QR identity for the appliance and keep its digital passport easy to access.",
    },
  ];

  useLayoutEffect(() => {
  const context = gsap.context(() => {
    gsap.from(heroRef.current.children, {
      y: 35,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
    });

    gsap.from(stepsRef.current.children, {
      y: 45,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: stepsRef.current,
        start: "top 80%",
      },
    });

    gsap.from(featureRef.current.children, {
      y: 35,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: featureRef.current,
        start: "top 80%",
      },
    });
  }, pageRef);

  return () => context.revert();
}, []);

  return (
    <main  ref={pageRef} className="how-it-works-page">
      <section  ref={heroRef} className="how-it-works-hero container">
        <p className="how-it-works-eyebrow">
          HOW APPLIO WORKS
        </p>

        <h1>
          Your appliance has a story.
          <span>APPLIO keeps the record.</span>
        </h1>

        <p className="how-it-works-hero__text">
          From the day you buy an appliance to every repair,
          warranty claim and maintenance record after it,
          APPLIO keeps everything connected in one digital passport.
        </p>

        <Link
          to="/appliances"
          className="how-it-works-hero__button"
        >
          Start your passport
          <FontAwesomeIcon icon={faArrowRight} />
        </Link>
      </section>

      <section className="how-it-works-process container">
        <div className="how-it-works-section-heading">
          <div>
            <p>THE APPLIO SYSTEM</p>
            <h2>Four simple steps.</h2>
          </div>

          <span>
            BUILT FOR THE FULL LIFECYCLE
          </span>
        </div>

        <div  ref={stepsRef} className="how-it-works-steps">
          {steps.map((step) => (
            <article
              className="how-it-works-step"
              key={step.number}
            >
              <div className="how-it-works-step__top">
                <span>{step.number}</span>

                <FontAwesomeIcon icon={step.icon} />
              </div>

              <div className="how-it-works-step__content">
                <h3>{step.title}</h3>

                <p>{step.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section   className="how-it-works-feature">
        <div  ref={featureRef} className="container how-it-works-feature__inner">
          <div>
            <p className="how-it-works-eyebrow">
              ONE DIGITAL IDENTITY
            </p>

            <h2>
              Stop losing the history
              <span>of what you own.</span>
            </h2>
          </div>

          <p className="how-it-works-feature__text">
            Appliance details, warranty coverage and service
            records belong together. APPLIO turns scattered
            information into one organized record you can keep
            throughout the appliance's life.
          </p>
        </div>
      </section>
    </main>
  );
};

export default HowItWorks;