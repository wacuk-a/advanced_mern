"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.generateSecureToken = generateSecureToken;
exports.hashData = hashData;
exports.generateAnonymousSessionId = generateAnonymousSessionId;
const crypto_1 = __importDefault(require("crypto"));
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const ITERATIONS = 100000;
// Generate encryption key from password
function deriveKey(password, salt) {
    return crypto_1.default.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, 'sha512');
}
// Encrypt data
function encrypt(text, password) {
    const salt = crypto_1.default.randomBytes(SALT_LENGTH);
    const key = deriveKey(password, salt);
    const iv = crypto_1.default.randomBytes(IV_LENGTH);
    const cipher = crypto_1.default.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag();
    // Combine salt + iv + tag + encrypted data
    return salt.toString('hex') + ':' + iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted;
}
// Decrypt data
function decrypt(encryptedData, password) {
    const parts = encryptedData.split(':');
    if (parts.length !== 4) {
        throw new Error('Invalid encrypted data format');
    }
    const salt = Buffer.from(parts[0], 'hex');
    const iv = Buffer.from(parts[1], 'hex');
    const tag = Buffer.from(parts[2], 'hex');
    const encrypted = parts[3];
    const key = deriveKey(password, salt);
    const decipher = crypto_1.default.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
// Generate secure random token
function generateSecureToken(length = 32) {
    return crypto_1.default.randomBytes(length).toString('hex');
}
// Hash data (one-way)
function hashData(data) {
    return crypto_1.default.createHash('sha256').update(data).digest('hex');
}
// Generate anonymous session ID
function generateAnonymousSessionId() {
    return 'anon_' + crypto_1.default.randomBytes(16).toString('hex') + '_' + Date.now();
}
//# sourceMappingURL=encryption.js.map