export const generateNonce = (length = 5) => {
  return Array.from({ length }, () => Math.floor(Math.random() * 256));
}