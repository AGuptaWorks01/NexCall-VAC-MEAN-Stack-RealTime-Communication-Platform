const passport = require( 'passport' );
const GoogleStrategy = require( 'passport-google-oauth20' ).Strategy;
const googleConfig = require( './google.config' );
const User = require( '../models/user.model' );

// Configure Google Strategy
passport.use( new GoogleStrategy( googleConfig,
    async ( accessToken, refreshToken, profile, done ) => {
        try
        {
            console.log( 'Google Profile:', profile ); // Debug log

            // Get email from profile
            const email = profile.emails && profile.emails[ 0 ] ? profile.emails[ 0 ].value : null;
            if ( !email )
            {
                return done( new Error( 'No email provided by Google' ), null );
            }

            // Check if user already exists
            let user = await User.findOne( { email: email } );

            if ( !user )
            {
                // Create username from email (remove domain and special characters)
                const emailUsername = email.split( '@' )[ 0 ].replace( /[^a-zA-Z0-9]/g, '' );
                const username = `${ emailUsername }${ Math.random().toString( 36 ).slice( -4 ) }`;

                // Create new user without password for Google OAuth
                user = await User.create( {
                    username: username,
                    email: email,
                    googleId: profile.id
                    // No password field - it's optional for Google OAuth users
                } );
            }

            return done( null, user );
        } catch ( error )
        {
            console.error( 'Error in Google strategy:', error );
            return done( error, null );
        }
    }
) );

// Serialize user for the session
passport.serializeUser( ( user, done ) => {
    done( null, user.id );
} );

// Deserialize user from the session
passport.deserializeUser( async ( id, done ) => {
    try
    {
        const user = await User.findById( id );
        done( null, user );
    } catch ( error )
    {
        done( error, null );
    }
} );

module.exports = passport; 