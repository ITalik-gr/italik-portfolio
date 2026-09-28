"use client";

import { useSyncExternalStore } from "react";
import { SITE } from "@/lib/site";

const formatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: SITE.location.timeZone,
});

function subscribe(onChange: () => void) {
  let interval: ReturnType<typeof setInterval> | undefined;
  // tick on the minute boundary, then every minute
  const timeout = setTimeout(
    () => {
      onChange();
      interval = setInterval(onChange, 60_000);
    },
    60_000 - (Date.now() % 60_000),
  );
  return () => {
    clearTimeout(timeout);
    clearInterval(interval);
  };
}

const getTime = () => formatter.format(new Date());
// the page is static, so the server can't know the visitor's "now"
const getServerTime = () => "";

export function KyivTime({ className }: { className?: string }) {
  const time = useSyncExternalStore(subscribe, getTime, getServerTime);

  return <time className={`inline-block min-w-[5ch] tabular-nums ${className ?? ""}`}>{time}</time>;
}
