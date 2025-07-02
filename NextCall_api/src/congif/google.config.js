require( 'dotenv' ).config();

const googleConfig = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: [ 'profile', 'email' ]
};

module.exports = googleConfig;


// ==================== not in use ==========================

// MONGO_URI = mongodb://localhost:27017/NextCall_VideoAudio
// PORT = 3000
// JWT_SECRET = I_am_JWT_SECRET

// GOOGLE_CLIENT_ID = 830012090791 - f5t6mq6qi29p9lqead2euotha2a49fis.apps.googleusercontent.com
// GOOGLE_CLIENT_SECRET = GOCSPX - XSzkI - CPHE9mlDYuyBdNne3g7_PW
// GOOGLE_CALLBACK_URL = http://localhost:3000/api/auth/google/callback
// SESSION_SECRET = e25c48848a2dfd3626d81ec9363cc510bb8ea81562f02d6275c2f6dc45da7624

