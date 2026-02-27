const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Mock User Schema logic
const userSchemaMock = {
    async preSave(password) {
        if (!password) return null;
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    },
    async matchPassword(enteredPassword, hashedOldPassword) {
        return await bcrypt.compare(enteredPassword, hashedOldPassword);
    }
};

async function runDiagnostic() {
    console.log('--- Auth Diagnostic Start ---');

    const testPassword = 'TestPassword123';
    console.log('Test Password:', testPassword);

    // Test Hashing
    const hashedPassword = await userSchemaMock.preSave(testPassword);
    console.log('Hashed Password:', hashedPassword);

    // Test Comparison
    const isMatch = await userSchemaMock.matchPassword(testPassword, hashedPassword);
    console.log('Comparison Result (Correct Password):', isMatch);

    const isMismatch = await userSchemaMock.matchPassword('WrongPassword', hashedPassword);
    console.log('Comparison Result (Wrong Password):', isMismatch);

    // Test for common pitfalls: trailing spaces
    const isMatchWithSpace = await userSchemaMock.matchPassword(testPassword + ' ', hashedPassword);
    console.log('Comparison Result (Correct Password + Space):', isMatchWithSpace);

    console.log('--- Auth Diagnostic End ---');
}

runDiagnostic().catch(console.error);
