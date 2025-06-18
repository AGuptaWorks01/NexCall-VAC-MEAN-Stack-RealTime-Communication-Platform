const passport = require( 'passport' );
const GoogleStrategy = require( 'passport-google-oauth20' ).Strategy;
const googleConfig = require( './google.config' );
const User = require( '../models/user.model' );
const { hasdPassword } = require( '../utils/hash' );

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
                // Generate a random password for Google users
                const randomPassword = Math.random().toString( 36 ).slice( -8 );
                const hashedPassword = await hasdPassword( randomPassword );

                // Create username from email (remove domain and special characters)
                const emailUsername = email.split( '@' )[ 0 ].replace( /[^a-zA-Z0-9]/g, '' );
                const username = `${ emailUsername }`;

                // Create new user
                user = await User.create( {
                    username: username,
                    email: email,
                    password: hashedPassword,
                    googleId: profile.id
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