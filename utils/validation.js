export const validateRequired = (fields) => {
    return Object.entries(fields).every(([, value]) => {
        return typeof value === "string" ? value.trim().length > 0 : value !== undefined && value !== null;
    });
};

export const validateId = (id) => {
    return /^\d+$/.test(String(id)) && Number(id) > 0;
};

export const validatePassword = (password) => {
    return typeof password === "string" && password.length >= 8;
};