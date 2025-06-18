require( 'dotenv' ).config(); // Load environment variables from .env file

const http = require( "http" );
const app = require( "./app" )
const { setupSocket } = require( "./congif/socket.config" )
const connectToMongo = require( "./congif/db.config" );
const User = require( './models/user.model' ); // Import User model

const PORT = process.env.PORT;

const startServer = async () => {
    try
    {
        // Connect to DB
        await connectToMongo();
        console.log( "MongoDB connected successfully." );

        // Reset all users to offline on server start
        const result = await User.updateMany( {}, { $set: { status: 0 } } );
        console.log( `Reset status for ${ result.modifiedCount } users to offline.` );

        // Create HTTP server with socket support
        const server = http.createServer( app );

        setupSocket( server ); // Attach WebSocket

        server.listen( PORT, () => {
            console.log( `Server is running at http://localhost:${ PORT }` );
        } );

    } catch ( error )
    {
        console.error( "Failed to start server:", error );
        process.exit( 1 );
    }
};

startServer();