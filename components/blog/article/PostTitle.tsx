const STAGGER_MS = 60;

// words rise from a mask one after another; pure CSS, so the title is there in the server HTML
export function PostTitle({ id, text }: { id: string; text: string }) {
  return (
    <h1
      id={id}
      aria-label={text}
      className="mt-fl-20/28 mb-fl-18/24 text-fl-42/76 leading-[0.95] font-semibold tracking-[-0.045em] text-balance"
    >
      {text.split(" ").map((word, index) => (
        <span key={index} aria-hidden>
          {index > 0 && " "}
          <span className="inline-block overflow-hidden pb-[0.08em] align-top">
            <span
              style={{ animationDelay: `${index * STAGGER_MS}ms` }}
              className="inline-block motion-safe:animate-word-up"
            >
              {word}
            </span>
          </span>
        </span>
      ))}
    </h1>
  );
}
