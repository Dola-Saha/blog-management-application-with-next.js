export const normalizeEmail = (email) => {
    return typeof email === "string" ? email.trim().toLowerCase() : "";
};

export const validateEmail = (email) => {
    return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};