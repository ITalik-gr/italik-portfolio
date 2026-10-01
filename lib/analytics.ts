import { HOME_KEY, HOMES } from "./site";

type Data = Record<string, string | number | boolean>;
type Umami = { track: (event: string, data?: Data) => void };

// public id of the italik.dev site in Umami Cloud
export const UMAMI_WEBSITE_ID = "5b0e66e7-ef65-4a39-9b99-0e93e6fab3cc";
// the only hosts that report; localhost and preview deploys stay out of the numbers
export const UMAMI_DOMAINS = "italik.dev,www.italik.dev";

// which kind of page an event came from, so client and employer clicks can be told apart
export function pageKind(pathname: string) {
  if (pathname === "/") return "client-home";
  if (pathname === "/services") return "services";
  if (pathname === "/blog") return "blog";
  if (pathname.startsWith("/blog/")) return "article";
  if (pathname.startsWith("/work/")) return "case";
  if (HOMES[pathname]?.audience === "employer") return "employer-home";
  return "other";
}

function lastHome() {
  try {
    return localStorage.getItem(HOME_KEY) ?? "/";
  } catch {
    return "/";
  }
}

// sent with every event, so any event can be split by page, audience, article, case and device
function context(): Data {
  const { pathname } = window.location;
  const page = pageKind(pathname);
  const home = HOMES[pathname] ? pathname : ["client-home", "services", "blog", "article"].includes(page) ? "/" : lastHome();
  const slug = pathname.split("/")[2];
  return {
    page,
    from: pathname,
    audience: HOMES[home]?.audience ?? "client",
    home,
    device: window.innerWidth < 768 ? "mobile" : window.innerWidth < 1280 ? "tablet" : "desktop",
    ...(page === "article" && slug && { post: slug }),
    ...(page === "case" && slug && { project: slug }),
  };
}

// events fired before the script has loaded (it waits for an idle moment) are sent once it's ready
const queue: [string, Data][] = [];

const umami = () => (window as unknown as { umami?: Umami }).umami;

export function track(event: string, data?: Data) {
  const payload = { ...context(), ...data };
  const client = umami();
  if (client) client.track(event, payload);
  else if (queue.length < 30) queue.push([event, payload]);
}

export function flushAnalytics() {
  const client = umami();
  if (client) queue.splice(0).forEach(([event, data]) => client.track(event, data));
}
