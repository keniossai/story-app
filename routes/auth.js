const express = require('express')
const passport = require('passport')
const router = express.Router()

// @desc Auth with goodle
// @route GET
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

// @desc Google auth redirect
// @route GET /auth/google/redirect
router.get(
	'/google/redirect',
	passport.authenticate('google', { failureRedirect: '/' }),
	(req, res) => {
		res.redirect('/dashboard')
	}
)

// @desc Logout User
// @route /auth/logout
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router
