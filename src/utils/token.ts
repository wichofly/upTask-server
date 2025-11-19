// Generates a 6-digit numeric token as a string
export const generateToken = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
