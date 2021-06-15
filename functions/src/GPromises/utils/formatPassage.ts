export function formatPassage(passage: string): string {
  const trimmedPassage = passage.trim();
  const formattedText =
    trimmedPassage[0].toLocaleUpperCase() !== trimmedPassage[0]
      ? `…${trimmedPassage}`
      : trimmedPassage;
  return formattedText
    .replace("¶", "")
    .replace(/[;:,]$/, "")
    .replace(/([\w])$/, "$1…");
}
