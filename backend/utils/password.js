import { timingSafeEqual } from "crypto";
import bcrypt from "bcrypt";

const bcryptHashPattern = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

export const verifyPassword = async (password, storedPassword) => {
    if (typeof storedPassword !== "string") {
        return { matches: false, upgradedHash: null };
    }

    if (storedPassword.startsWith("$2")) {
        if (!bcryptHashPattern.test(storedPassword)) {
            return { matches: false, upgradedHash: null };
        }

        return {
            matches: await bcrypt.compare(password, storedPassword),
            upgradedHash: null
        };
    }

    const submitted = Buffer.from(password);
    const stored = Buffer.from(storedPassword);
    const matches = submitted.length === stored.length && timingSafeEqual(submitted, stored);

    return {
        matches,
        upgradedHash: matches ? await bcrypt.hash(password, 10) : null
    };
};
