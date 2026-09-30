import { HERO_TRAIL } from "@/lib/site";
import { cn } from "@/lib/utils";

// touch screens have no cursor: three faint screenshots drift slowly behind the title instead
const SHOTS = [
  { project: HERO_TRAIL[1], place: "top-[6%] left-[4%]", duration: "20s", delay: "0s" },
  { project: HERO_TRAIL[0], place: "top-[18%] right-[4%]", duration: "23s", delay: "-7s" },
  { project: HERO_TRAIL[3], place: "top-[34%] left-[18%]", duration: "26s", delay: "-15s" },
];

export function TrailDrift() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 | md:hidden md:pointer-coarse:block | motion-reduce:hidden"
    >
      {SHOTS.map(({ project, place, duration, delay }) => (
        <figure
          key={project.src}
          style={{ animationDuration: duration, animationDelay: delay }}
          className={cn("absolute w-[120px] animate-drift opacity-25", place)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- 6 KB decoration, no need for the image optimizer */}
          <img
            src={project.src}
            alt=""
            width={120}
            height={75}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            className="block h-[75px] w-[120px] border border-line"
          />
          <figcaption className="absolute bottom-[4px] left-[4px] bg-bg px-[4px] py-[1px] font-mono text-[9px] leading-[12px] text-text-2">
            {project.title}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
