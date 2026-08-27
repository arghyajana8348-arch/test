"use client";

import React, { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface SmoothScrollProps {
  children: React.ReactNode;
  /** Set true if scrolling inside a modal to pause Lenis smooth scroll */
  isInsideModal?: boolean;
  /** Lenis animation duration in seconds (default: 2) */
  duration?: number;
  /** Class name for modal containers that should prevent smooth scroll */
  modalClassName?: string;
}

export default function SmoothScroll({
  children,
  isInsideModal = false,
  duration = 2,
  modalClassName = "modal-open",
}: SmoothScrollProps) {
  // Re-evaluate ScrollTrigger on each Lenis scroll frame
  const lenis = useLenis(() => ScrollTrigger.update());

  useEffect(() => {
    if (!lenis) return;
    // Sync Lenis with GSAP's ticker
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(raf);
  }, [lenis]);

  return (
    <ReactLenis
      root
      autoRaf={false}
      options={{
        duration,
        prevent: (node) => {
          if (isInsideModal) return true;
          return node.classList.contains(modalClassName);
        },
      }}
    >
      {children}
    </ReactLenis>
  );
}
