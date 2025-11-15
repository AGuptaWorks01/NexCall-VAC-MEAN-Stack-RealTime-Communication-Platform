require('dotenv').config();
const passport = require( 'passport' )
const { Strategy: JwtStrategy, ExtractJwt } = require( 'passport-jwt' )
const User = require( '../models/user.model' )
console.log("Loaded JWT_SECRET:", process.env.JWT_SECRET);


const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    issuer: 'YourAppIssuer',
    // audience: 'YourAppAudience' // Example: Add audience validation, replace with actual audience
};

passport.use(
    new JwtStrategy( opts, async ( jwt_payload, done ) => {
        try
        {
            const user = await User.findById( jwt_payload.id )

            if ( user )
            {
                return done( null, user ); // user found, pass to req.user
            } else
            {
                return done( null, false ); // no user found
            }
        } catch ( err )
        {
            return done( err, false );
        }
    } )
);

module.exports = passport;