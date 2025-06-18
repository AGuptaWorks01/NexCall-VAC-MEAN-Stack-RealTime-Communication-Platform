const express = require( 'express' );
const cors = require( 'cors' );
const path = require( "path" );
const helmet = require( 'helmet' );
const morgan = require( 'morgan' );
const compression = require( 'compression' );
const crid = require( 'connect-rid' );
const swaggerUi = require( 'swagger-ui-express' );
const YAML = require( "yamljs" );
const rateLimit = require( 'express-rate-limit' );
const session = require( 'express-session' );
const passport = require( 'passport' );

// Import passport configurations
require( './congif/passport-jwt' );
require( './congif/passport.config' );

const auth = require( './routes/auth.routes' );
const protectedauth = require( './routes/Authprotected.routes' );
const swaggerDocument = YAML.load( './src/docs/swagger.doc.yaml' )

const app = express();

// ======== MIDDLEWARE SETUP ========

// Define allowed origins for CORS
// For production, use your actual frontend domain(s)
// const allowedOrigins = ['https://yourfrontenddomain.com', 'https://anotherfrontend.com'];
// For local development, adjust ports as needed
const allowedOrigins = [ 'http://localhost:4300' ]; // Added current port for potential local frontend

app.use( cors( {
    origin: function ( origin, callback ) {
        // Allow requests with no origin (like mobile apps or curl requests in some cases)
        // OR if the origin is in our list of allowed origins
        if ( !origin || allowedOrigins.indexOf( origin ) !== -1 )
        {
            callback( null, true );
        } else
        {
            callback( new Error( 'Not allowed by CORS' ) );
        }
    },
    methods: [ 'GET', 'POST', 'PUT', 'DELETE', 'OPTIONS' ], // Ensure OPTIONS is included for preflight
    allowedHeaders: [ 'Content-Type', 'Authorization', 'X-Requested-With' ], // Add any other custom headers your frontend might send
    credentials: true // Set to true if your frontend needs to send cookies or use Authorization headers with CORS
} ) );

// Parse JSON and URL-encoded bodies
app.use( express.json() );
app.use( express.urlencoded( { extended: true } ) );

// Content Security Policy (CSP) - placeholder, needs careful configuration
app.use( ( req, res, next ) => {
    res.setHeader(
        'Content-Security-Policy',
        // "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; media-src 'self' blob:; connect-src 'self' wss://yoursignalserver.com https://yourturnserver.com; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
        "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' ws://localhost:3000 wss://localhost:3000;" // Basic CSP for local dev, allowing inline styles and WebSocket connections to self.
    );
    next()
} )

// Security HTTP headers with Helmet
app.use( helmet( {
    // If you need to adjust specific Helmet policies, e.g., for CSP if Helmet's default is too strict
    // contentSecurityPolicy: false, // (If you are managing CSP completely separately as above)
} ) );

// HTTP request logger
app.use( morgan( 'dev' ) ); // Consider 'combined' for production or a structured logger

// Compress response bodies
app.use( compression() );

// Assign unique request IDs
app.use( crid() );

// Session configuration
app.use( session( {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
} ) );

// Initialize Passport and restore authentication state from session
app.use( passport.initialize() );
app.use( passport.session() );

// Rate Limiting
const authLimiter = rateLimit( {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 auth requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: { error: 'Too many login attempts from this IP, please try again after 15 minutes' }
} );

app.use( '/api/auth', authLimiter ); // Apply auth limiter to auth routes
// app.use('/api/', generalApiLimiter); // Apply general limiter to other /api/ routes. Be cautious with WebSocket upgrade requests.

// Serve static files
app.use( express.static( path.join( __dirname, "../public" ) ) );

// Basic route
app.get( "/", ( req, res ) => {
    res.sendFile( path.join( __dirname, "../public/index.html" ) );
} );

// API routes
app.use( '/api', auth );
app.use( '/api', protectedauth );

// API Docs - Consider protecting this in production
// Example: Basic Auth
// const basicAuth = require('express-basic-auth');
// app.use('/api-docs', basicAuth({
//     users: { [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD },
//     challenge: true,
// }));
app.use( "/api-docs", swaggerUi.serve, swaggerUi.setup( swaggerDocument ) )

module.exports = app;
