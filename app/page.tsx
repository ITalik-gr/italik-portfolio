export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col justify-center gap-[24px] px-[20px] | md:px-[40px]">
      <p className="font-mono text-[13px] uppercase tracking-[0.08em] text-muted">
        <span className="text-accent">00</span> Setup
      </p>
      <h1 className="font-display text-[64px] font-[680] leading-[0.85] tracking-[-0.055em] [font-stretch:88%] | xl:text-[224px]">
        I build AI agents that ship
      </h1>
      <p className="max-w-[780px] text-[20px] leading-[28px] tracking-[-0.015em] text-text-3 | md:text-[26px] md:leading-[34px]">
        Full-stack developer. I design, build and ship AI agents into real products.
      </p>
    </main>
  );
}
