export function formatPassage(passage: string): string {
  const formattedText = passage
    .trim()
    .replace("¶", "")
    .replace(/[;:,]$/, "")
    .trim()
    .replace(/([\w])$/, "$1…");
  return formattedText[0].toLocaleUpperCase() !== formattedText[0]
    ? `…${formattedText}`
    : formattedText;
}
