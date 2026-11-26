import assert from "node:assert/strict";
import { test } from "node:test";
import bcrypt from "bcrypt";
import { verifyPassword } from "../utils/password.js";

test("verifies bcrypt passwords without changing their hash", async () => {
    const hash = await bcrypt.hash("correct-password", 10);

    const result = await verifyPassword("correct-password", hash);

    assert.equal(result.matches, true);
    assert.equal(result.upgradedHash, null);
});

test("upgrades a matching legacy plain-text password", async () => {
    const result = await verifyPassword("legacy-password", "legacy-password");

    assert.equal(result.matches, true);
    assert.ok(result.upgradedHash);
    assert.equal(await bcrypt.compare("legacy-password", result.upgradedHash), true);
});

test("does not accept an incorrect or malformed password hash", async () => {
    const wrongPassword = await verifyPassword("wrong-password", "legacy-password");
    const malformedHash = await verifyPassword("password", "$2b$not-a-valid-hash");

    assert.equal(wrongPassword.matches, false);
    assert.equal(wrongPassword.upgradedHash, null);
    assert.equal(malformedHash.matches, false);
});
