import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import logger from '../../../utils/logger.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/v1/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      logger.info(`Google OAuth callback for user: ${profile.email}`);
      
      const user = {
        id: profile.id,
        username: profile.displayName,
        email: profile.email,
        avatar: profile.photos?.[0]?.value,
        role: 'user',
        provider: 'google',
      };
      
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
