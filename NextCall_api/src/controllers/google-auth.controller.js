const passport = require( 'passport' );
const { generateToken } = require( '../utils/jwt' );
const User = require( '../models/user.model' );
const { hasdPassword } = require( '../utils/hash' );

const googleAuth = {
    // Initiate Google OAuth
    googleLogin: passport.authenticate( 'google', {
        scope: [ 'profile', 'email' ],
        prompt: 'select_account' // This ensures the user always sees the account selection screen
    } ),

    // Google OAuth callback
    googleCallback: ( req, res, next ) => {
        passport.authenticate( 'google', { session: false }, async ( err, user, info ) => {
            if ( err )
            {
                console.error( 'Google auth error:', err );
                return res.redirect( 'http://localhost:4300/login?error=auth_failed' );
            }
            if ( !user )
            {
                console.error( 'No user returned from Google auth' );
                return res.redirect( 'http://localhost:4300/login?error=no_user' );
            }

            try
            {
                // Generate JWT token
                const token = generateToken( {
                    id: user._id,
                    email: user.email,
                    username: user.username
                } );

                // Redirect to frontend with token
                res.redirect( `http://localhost:4300/auth-callback?token=${ token }` );
            } catch ( error )
            {
                console.error( 'Error in Google callback:', error );
                res.redirect( 'http://localhost:4300/login?error=server_error' );
            }
        } )( req, res, next );
    },

    // Logout route
    logout: ( req, res ) => {
        req.logout( ( err ) => {
            if ( err )
            {
                return res.status( 500 ).json( { error: 'Error during logout' } );
            }
            res.redirect( 'http://localhost:4300/login' );
        } );
    }
};

module.exports = googleAuth; 