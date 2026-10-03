type Props = {
  id: string;
  text: string;
  className?: string;
};

const STAGGER_MS = 28;

// a pure CSS reveal, so the title shows straight from server HTML; lines break wherever the width allows
export function SplitHeading({ id, text, className }: Props) {
  let index = 0;

  return (
    // real text in sr-only, so crawlers that skip aria-hidden still read a non-empty h1
    <h1 id={id} className={className}>
      <span className="sr-only">{text}</span>
      {text.split(" ").map((word, wordIndex) => (
        <span key={wordIndex} aria-hidden>
          {wordIndex > 0 && " "}
          <span className="inline-block whitespace-nowrap">
            {[...word].map((char, charIndex) => (
              <span
                key={charIndex}
                data-letter
                style={{ animationDelay: `${index++ * STAGGER_MS}ms` }}
                className="inline-block motion-safe:animate-letter-in"
              >
                {char}
              </span>
            ))}
          </span>
        </span>
      ))}
    </h1>
  );
}
