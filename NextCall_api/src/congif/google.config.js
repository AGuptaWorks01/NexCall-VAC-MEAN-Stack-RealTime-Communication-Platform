require( 'dotenv' ).config();

const googleConfig = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.REDIRECT_URL,
    scope: [ 'profile', 'email' ]
};

module.exports = googleConfig;
