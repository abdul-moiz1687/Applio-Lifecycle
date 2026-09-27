import { useEffect, useRef } from "react";
import gsap from "gsap";

import "./CursorFollower.css";

const CursorFollower = () => {
  const cursorRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const label = labelRef.current;

    if (!cursor || !label) {
      return;
    }

    const finePointer = window.matchMedia(
      "(pointer: fine)"
    ).matches;

    if (!finePointer) {
      return;
    }

    const xTo = gsap.quickTo(cursor, "x", {
      duration: 0.35,
      ease: "power3.out",
    });

    const yTo = gsap.quickTo(cursor, "y", {
      duration: 0.35,
      ease: "power3.out",
    });

    let activeElement = null;

    const updateHoverState = (element) => {
      if (element === activeElement) {
        return;
      }

      activeElement = element;

      if (element) {
        const isLink = element.tagName === "A";

        label.textContent = isLink
          ? "VIEW"
          : "GO";

        cursor.classList.add("is-active");

        gsap.to(cursor, {
          scale: 3,
          duration: 0.35,
          ease: "back.out(1.6)",
        });
      } else {
        label.textContent = "";

        cursor.classList.remove("is-active");

        gsap.to(cursor, {
          scale: 1,
          duration: 0.3,
          ease: "power3.out",
        });
      }
    };

    const handleMouseMove = (event) => {
      const target = event.target.closest(
        "a, button"
      );

      updateHoverState(target);

      let targetX = event.clientX;
      let targetY = event.clientY;

      if (target) {
        const rect = target.getBoundingClientRect();

        const centerX =
          rect.left + rect.width / 2;

        const centerY =
          rect.top + rect.height / 2;

        const pull = 0.12;

        targetX =
          event.clientX +
          (centerX - event.clientX) * pull;

        targetY =
          event.clientY +
          (centerY - event.clientY) * pull;
      }

      xTo(targetX);
      yTo(targetY);
    };

    const handleMouseDown = () => {
      gsap.to(cursor, {
        scale: activeElement ? 2.35 : 0.75,
        duration: 0.12,
        ease: "power2.out",
      });
    };

    const handleMouseUp = () => {
      gsap.to(cursor, {
        scale: activeElement ? 3 : 1,
        duration: 0.25,
        ease: "back.out(1.7)",
      });
    };

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    window.addEventListener(
      "mousedown",
      handleMouseDown
    );

    window.addEventListener(
      "mouseup",
      handleMouseUp
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      window.removeEventListener(
        "mousedown",
        handleMouseDown
      );

      window.removeEventListener(
        "mouseup",
        handleMouseUp
      );
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="cursor-follower"
      aria-hidden="true"
    >
      <span className="cursor-follower__core" />

      <span
        ref={labelRef}
        className="cursor-follower__label"
      />
    </div>
  );
};

export default CursorFollower;