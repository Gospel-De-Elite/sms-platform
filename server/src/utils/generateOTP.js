const crypto = require("crypto");

const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

const generateToken = () => {
    return crypto.randomBytes(32).toString("hex");
};

module.exports = { generateOTP, generateToken };