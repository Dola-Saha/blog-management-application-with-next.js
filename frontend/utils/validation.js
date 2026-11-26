export const isRequired = (value) => typeof value === "string" && value.trim().length > 0;

export const isValidEmail = (email) =>
  typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const isValidPassword = (password) =>
  typeof password === "string" && password.length >= 8;

export const passwordsMatch = (password, confirmation) =>
  isValidPassword(password) && password === confirmation;

export const isValidProfileImage = (file) => {
  if (!file) return false;
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  return allowedTypes.includes(file.type) && file.size <= 3 * 1024 * 1024;
};
