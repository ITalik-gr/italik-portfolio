import { HomePage } from "@/components/home/HomePage";
import { PROFILES } from "@/lib/profiles";

export default function Home() {
  return <HomePage profile={PROFILES.ai} />;
}
