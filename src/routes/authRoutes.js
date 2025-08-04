const express = require('express');
const passport = require('passport');
const router = express.Router();

const ensureAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    next();
};


router.get('/google', ensureAuth, passport.authenticate('google', { scope: ['profile'] }));


router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
   
        res.redirect('http://localhost:5173/dashboard');
    }
);


router.get('/logout', (req, res, next) => {
    req.logout((logoutErr) => {
        if (logoutErr) {
            return next(logoutErr);
        }
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return next(err);
            }
            res.redirect('/');
        });
    });
});

module.exports = router;