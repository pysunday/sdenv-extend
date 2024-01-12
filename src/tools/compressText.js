export function compressText(text, max = 100) {
  if (text.length <= max) {
    return text;
  }

  const truncatedText = text.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ');
  return `${truncatedText.slice(0, max)}......`;
}
