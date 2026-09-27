import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

import "./Marquee.css";

const Marquee = () => {
  const trackRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(trackRef.current, {
        xPercent: -50,
        duration: 24,
        ease: "none",
        repeat: -1,
      });
    }, trackRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="marquee">
      <div ref={trackRef} className="marquee__track">
        <div className="marquee__group">
          <span>DIGITAL PASSPORT</span>
          <i>•</i>

          <span>WARRANTY</span>
          <i>•</i>

          <span>SERVICE HISTORY</span>
          <i>•</i>

          <span>MAINTENANCE</span>
          <i>•</i>

          <span>LIFECYCLE RECORD</span>
          <i>•</i>
        </div>

        <div className="marquee__group" aria-hidden="true">
          <span>DIGITAL PASSPORT</span>
          <i>•</i>

          <span>WARRANTY</span>
          <i>•</i>

          <span>SERVICE HISTORY</span>
          <i>•</i>

          <span>MAINTENANCE</span>
          <i>•</i>

          <span>LIFECYCLE RECORD</span>
          <i>•</i>
        </div>
      </div>
    </section>
  );
};

export default Marquee;