const express = require( 'express' );
const router = express.Router();
const authController = require( '../controllers/auth.controller' );
const validate = require( '../validations/auth.validation' );
const googleAuthController = require( '../controllers/google-auth.controller' );

// Regular authentication routes
router.post( '/register', validate.register, authController.register );
router.post( '/login', validate.login, authController.login );
router.get( '/get', authController.get );
router.get( '/auth/status', authController.checkAuthStatus );

// Google OAuth routes - ensure these match exactly with Google Cloud Console
router.get( '/auth/google', googleAuthController.googleLogin );
router.get( '/auth/google/callback', googleAuthController.googleCallback );
router.get( '/auth/logout', googleAuthController.logout );


module.exports = router;