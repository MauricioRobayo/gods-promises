export const cleanPassage = (passage: string): string => {
  const cleanedText = passage
    .replace("¶", "")
    .trim()
    .replace(/[^\w?!'"]$/, ".");
  return /\w$/.test(cleanedText) ? `${cleanedText}.` : cleanedText;
};
