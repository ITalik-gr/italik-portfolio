import { Arrow } from "@/components/ui/Button";
import { MORE_PROJECTS } from "@/lib/site-lists";

export function MoreProjects() {
  return (
    <div className="mt-fl-72/140 grid gap-[24px] | lg:grid-cols-[440px_1fr] lg:gap-[40px]">
      <div className="flex flex-col gap-[12px]">
        <h3 className="text-[14px] leading-[20px] text-muted">
          More projects
        </h3>
        <p className="text-fl-20/23 leading-[1.3] tracking-[-0.01em]">{MORE_PROJECTS.caption}</p>
      </div>
      <ul>
        {MORE_PROJECTS.items.map((item) => (
          <li key={item.name} className="border-b border-line">
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid grid-cols-[1fr_24px] items-center gap-x-[16px] gap-y-[6px] py-[18px] transition-colors duration-150 hover:text-accent | md:grid-cols-[1fr_1fr_40px] md:py-[22px]"
            >
              <span className="text-fl-20/23 leading-[1.1] tracking-[-0.01em]">{item.name}</span>
              <span className="order-3 text-[13px] leading-[18px] text-muted | md:order-none md:text-[14px] md:leading-[20px]">
                {item.category}
              </span>
              <span className="row-span-2 justify-self-end font-mono text-[16px] text-muted group-hover:text-accent | md:row-span-1">
                <Arrow arrow="↗" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
