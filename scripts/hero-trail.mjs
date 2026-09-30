// builds the small hero-trail screenshots from the case images: node scripts/hero-trail.mjs
import { mkdir, stat } from "node:fs/promises";
import { createRequire } from "node:module";

// sharp comes with next; it isn't a direct dependency, so resolve it from there
const require = createRequire(createRequire(import.meta.url).resolve("next/package.json"));
const sharp = require("sharp");

const SOURCES = {
  "money-track": "public/work/money-track/dashboard-desktop-dark.png",
  "lottie-theme": "public/work/lottie-theme/editor.png",
  "tg-assistant": "public/work/tg-assistant/cover.png",
  "ppc-io": "public/work/ppc-io/cover.jpg",
  sollas: "public/work/sollas/hero-screen.png",
};
const OUT = "public/hero-trail";
const MAX_BYTES = 20 * 1024;

await mkdir(OUT, { recursive: true });
for (const [name, src] of Object.entries(SOURCES)) {
  const file = `${OUT}/${name}.webp`;
  // step the quality down until the file fits the budget
  for (let quality = 80; quality >= 40; quality -= 5) {
    await sharp(src)
      .resize(400, 250, { fit: "cover", position: "top" })
      .webp({ quality, effort: 6 })
      .toFile(file);
    const { size } = await stat(file);
    if (size <= MAX_BYTES || quality === 40) {
      console.log(`${file}  ${(size / 1024).toFixed(1)} KB  q${quality}`);
      break;
    }
  }
}
