const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");

// ─── Initiate Google OAuth ────────────────────────────
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false,
    })
);

// ─── Google OAuth Callback ────────────────────────────
router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`,
    }),
    (req, res) => {
        const user = req.user;
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Redirect to frontend with tokens in query params
        res.redirect(
            `${process.env.CLIENT_URL}/auth/google/success?accessToken=${accessToken}&refreshToken=${refreshToken}&firstName=${user.firstName}`
        );
    }
);

module.exports = router;