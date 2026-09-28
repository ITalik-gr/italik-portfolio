"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import "lenis/dist/lenis.css";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

// lenis owns the scroll and runs on gsap's ticker, so ScrollTrigger reads the smoothed position
export function SmoothScroll() {
  const lenisRef = useRef<LenisRef>(null);

  useLenis(ScrollTrigger.update);

  useEffect(() => {
    // read the instance on every tick: lenis is created after this effect runs
    const tick = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(tick);
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        // same-page anchors glide and still honour scroll-margin-top under the sticky header
        anchors: true,
        // the mobile menu locks scroll with overflow: hidden; lenis pauses with it
        autoToggle: true,
        // the chat log scrolls on its own
        allowNestedScroll: true,
        stopInertiaOnNavigate: true,
      }}
    />
  );
}
