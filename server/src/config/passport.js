const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const prisma = require("./db");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const firstName = profile.name.givenName;
                const lastName = profile.name.familyName;
                const googleId = profile.id;

                // Check if user already exists
                let user = await prisma.user.findUnique({ where: { email } });

                if (user) {
                    // User exists — update googleId if not set
                    if (!user.googleId) {
                        user = await prisma.user.update({
                            where: { email },
                            data: { googleId, isVerified: true },
                        });
                    }
                    return done(null, user);
                }

                // New user — create account
                user = await prisma.$transaction(async (tx) => {
                    const newUser = await tx.user.create({
                        data: {
                            firstName,
                            lastName,
                            email,
                            googleId,
                            isVerified: true, // Google emails are pre-verified
                        },
                    });

                    await tx.wallet.create({
                        data: { userId: newUser.id },
                    });

                    return newUser;
                });

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

module.exports = passport;