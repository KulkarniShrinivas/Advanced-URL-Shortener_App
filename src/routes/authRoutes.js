const express = require('express');
const passport = require('passport');
const router = express.Router();

/**
 * @swagger
 * tags:
 * name: Authentication
 * description: Everything to do with logging in and out using Google.
 */

/**
 * @swagger
 * /auth/google:
 * get:
 * summary: Log in with Google
 * tags: [Authentication]
 * description: This endpoint starts the Google Sign-In process. Just hit this URL, and you'll be redirected to Google to authorize your account.
 * responses:
 * 302:
 * description: Redirect to Google for authentication.
 */
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

/**
 * @swagger
 * /auth/google/callback:
 * get:
 * summary: Google OAuth callback
 * tags: [Authentication]
 * description: This is a private endpoint that handles the response from Google after a successful login. It will create a user in our database if one doesn't exist and log you in.
 * responses:
 * 302:
 * description: Successfully logged in. You will be redirected to the dashboard.
 * 401:
 * description: Authentication failed for some reason.
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

/**
 * @swagger
 * /auth/logout:
 * get:
 * summary: Log out
 * tags: [Authentication]
 * description: Use this to end your current session. It will clear your login status.
 * responses:
 * 302:
 * description: Successfully logged out. You will be redirected to the homepage.
 */
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;