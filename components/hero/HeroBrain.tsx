"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// the canvas is decoration: it loads after the page, never on the server
const BrainCanvas = dynamic(() => import("./BrainCanvas").then((m) => m.BrainCanvas), {
  ssr: false,
});

// wait for the load event and an idle moment, so the graph never competes with the headline (LCP)
export function HeroBrain() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idle = 0;
    const schedule = () => {
      idle = window.requestIdleCallback
        ? window.requestIdleCallback(() => setReady(true), { timeout: 1500 })
        : window.setTimeout(() => setReady(true), 200);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      window.removeEventListener("load", schedule);
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      window.clearTimeout(idle);
    };
  }, []);

  return ready ? <BrainCanvas /> : null;
}
