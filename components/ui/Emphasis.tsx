// renders **bold** fragments from content as white semi-bold text
export function Emphasis({ text }: { text: string }) {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, index) =>
    part.startsWith("**") ? (
      <strong key={index} className="font-semibold text-text">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );
}
