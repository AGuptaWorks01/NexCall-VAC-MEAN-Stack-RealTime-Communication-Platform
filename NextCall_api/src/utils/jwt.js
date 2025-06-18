const jwt = require( 'jsonwebtoken' )
const SECRET = process.env.JWT_SECRET

exports.generateToken =
    ( payload ) => {
        const options = {
            expiresIn: '1h',
            issuer: 'YourAppIssuer' // Replace with your actual app identifier
        };
        return jwt.sign( payload, SECRET, options );
    }

// exports.verifyToken =
//     (token) =>
//         jwt.verify(token, SECRET)
