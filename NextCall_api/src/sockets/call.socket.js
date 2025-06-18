// const resgiterCallSocket = (io, socket) => {
//     socket.on("chat message", (msg) => {
//         console.log("Message received:", msg);
//         io.emit("chat message", msg)
//     })
// }
// module.exports = resgiterCallSocket



const users = {};

const registerCallSocket = ( io, socket ) => {
    // Save user on join
    socket.on( "register", ( username ) => {
        users[ socket.id ] = { username };
        console.log( `${ username } connected with socket ID ${ socket.id }` );

        // Send all users to all clients
        io.emit( "userList", Object.entries( users ).map( ( [ id, u ] ) => ( { id, username: u.username } ) ) );
    } );

    // Handle private message
    socket.on( "private message", ( { to, message } ) => {
        const fromUser = users[ socket.id ];
        if ( fromUser && to && users[ to ] )
        {
            io.to( to ).emit( "private message", {
                from: fromUser.username,
                message,
            } );
        }
    } );

    // Handle disconnect
    socket.on( "disconnect", () => {
        delete users[ socket.id ];
        io.emit( "userList", Object.entries( users ).map( ( [ id, u ] ) => ( { id, username: u.username } ) ) );
    } );
};

module.exports = registerCallSocket;
