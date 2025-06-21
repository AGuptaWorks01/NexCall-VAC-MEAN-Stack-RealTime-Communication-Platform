const express = require( 'express' );
const router = express.Router();
// const authController = require('../controllers/auth.controller');
// const validate = require('../validations/auth.validation');
const passport = require( 'passport' )

// Middleware to check authentication (either JWT or session)
const authenticateUser = ( req, res, next ) => {
    // First try JWT authentication
    passport.authenticate( 'jwt', { session: false }, ( err, user, info ) => {
        if ( user )
        {
            req.user = user;
            return next();
        }

        // If JWT fails, check session authentication
        if ( req.isAuthenticated() )
        {
            return next();
        }

        // If both fail, return unauthorized
        res.status( 401 ).json( { message: 'Unauthorized' } );
    } )( req, res, next );
};

// Apply authentication middleware to all protected routes
router.use( authenticateUser );

// protected.routes.js
router.get( '/dashboard', ( req, res ) => {
    res.json( { msg: 'dashboard Profile route', user: req.user } );
} );

// This route is protected, it requires a valid JWT token
router.get( '/profile', ( req, res ) => {
    res.json( { msg: 'User Profile route', user: req.user } );
} );

module.exports = router;