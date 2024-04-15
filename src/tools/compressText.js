export function compressText(text, max = 100) {
  if (typeof text !== 'string') text = `${text}`;
  if (text.length <= max) {
    return text;
  }
  return text.replace(/[\n\s\r]+/g, ' ').slice(0, max) + '......';
}
