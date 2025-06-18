const { Server } = require( "socket.io" );
const registerChatSocket = require( "../sockets/chat.socket" );

function setupSocket ( server ) {
    const io = new Server( server, {
        cors: {
            origin: "*", // Update if needed for security
        },
    } );

    io.on( "connection", ( socket ) => {
        console.log( "Socket connected:", socket.id );
        registerChatSocket( io, socket );
    } );
}

module.exports = { setupSocket };


