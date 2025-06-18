const ChatService = require( '../services/chat.service' );
const User = require( '../models/user.model' );
const Message = require( '../models/message.model' );
const authService = require( '../services/auth.service' );

const registerChatSocket = ( io, socket ) => {
    // Register user
    socket.on( "register", async ( username ) => {
        try
        {
            const user = await User.findOneAndUpdate(
                { username },
                { status: 1 },
                { new: true, select: 'username email role status' }
            );

            if ( !user )
            {
                // Handle case where user is not found in DB
                socket.emit( "error", { message: "Authentication error: User not found." } );
                return;
            }

            // Add user with their full details to the chat service
            const onlineUsers = ChatService.addUser( socket.id, user.toObject() );
            console.log( `${ user.username } (role: ${ user.role }) is now ${ user.status }` );

            // Broadcast the updated online user list to everyone
            const allDbUsers = await User.find( {}, 'username email role status' );
            io.emit( "allUserList", allDbUsers );

            io.emit( "groupList", ChatService.getAllGroups() );
        } catch ( error )
        {
            console.error( "Error during user registration:", error );
            socket.emit( "error", { message: "Could not register user." } );
        }
    } );

    // New event to get chat history
    socket.on( "get chat history", async ( { otherUsername } ) => {
        const fromUser = ChatService.users[ socket.id ];
        if ( fromUser && otherUsername )
        {
            try
            {
                const history = await authService.getChatHistory( fromUser.username, otherUsername );
                // Send history back to the requesting client only
                socket.emit( "chat history", history );
            } catch ( error )
            {
                console.error( "Error fetching chat history:", error );
                socket.emit( "error", { message: "Could not retrieve chat history." } );
            }
        }
    } );

    // Handle private message
    socket.on( "private message", async ( { toUsername, message } ) => {
        const fromUser = ChatService.users[ socket.id ];
        const toSocketId = ChatService.usernameToSocketId[ toUsername ];

        if ( fromUser && toUsername )
        {
            try
            {
                // Save message to database
                const newMessage = new Message( {
                    from: fromUser.username,
                    to: toUsername,
                    message: message,
                } );
                await newMessage.save();

                // Send the saved message back to the sender
                socket.emit( "private message", newMessage );

                // If recipient is online, also send it to them
                if ( toSocketId )
                {
                    io.to( toSocketId ).emit( "private message", newMessage );
                }
            } catch ( error )
            {
                console.error( "Error saving or sending private message:", error );
                socket.emit( "error", { message: "Failed to send message." } );
            }
        } else
        {
            // This case should be rare if UI prevents sending to offline users, but good to have
            console.log( `Could not send private message: User ${ toUsername } not found or is offline.` );
            socket.emit( "error", { message: `Could not send message. User ${ toUsername } is not online.` } );
        }
    } );

    // Create group
    socket.on( "create group", ( groupName ) => {
        const group = ChatService.createGroup( groupName, socket.id );
        io.emit( "groupList", ChatService.getAllGroups() );
        socket.join( group.id );
    } );

    // Join group
    socket.on( "join group", ( groupId ) => {
        if ( ChatService.joinGroup( groupId, socket.id ) )
        {
            socket.join( groupId );
            const username = ChatService.users[ socket.id ]?.username;
            io.to( groupId ).emit( "group message", {
                type: "system",
                message: `${ username } joined the group`
            } );
            io.emit( "groupList", ChatService.getAllGroups() );
        }
    } );

    // Leave group
    socket.on( "leave group", ( groupId ) => {
        if ( ChatService.leaveGroup( groupId, socket.id ) )
        {
            socket.leave( groupId );
            const username = ChatService.users[ socket.id ]?.username;
            io.to( groupId ).emit( "group message", {
                type: "system",
                message: `${ username } left the group`
            } );
            io.emit( "groupList", ChatService.getAllGroups() );
        }
    } );

    // Group message
    socket.on( "group message", ( { groupId, message } ) => {
        const fromUser = ChatService.users[ socket.id ];
        if ( fromUser && ChatService.getGroupMembers( groupId ).includes( socket.id ) )
        {
            const messageObj = {
                type: "message",
                from: fromUser.username,
                message,
                timestamp: new Date()
            };
            ChatService.addMessageToGroup( groupId, messageObj );
            io.to( groupId ).emit( "group message", messageObj );
        }
    } );

    // Delete group (Admin only)
    socket.on( "delete group", ( groupId ) => {
        const user = ChatService.users[ socket.id ];
        // Check if user exists and has the 'admin' role
        if ( user && user.role === 'admin' )
        {
            if ( ChatService.deleteGroup( groupId ) )
            {
                // Broadcast the updated group list to all clients
                io.emit( "groupList", ChatService.getAllGroups() );
                console.log( `Admin ${ user.username } deleted group ${ groupId }` );
            }
        } else
        {
            // Optionally, send an error back to the client if they are not an admin
            socket.emit( "error", { message: "You are not authorized to delete groups." } );
        }
    } );

    // Handle disconnect
    socket.on( "disconnect", async () => {
        const user = ChatService.users[ socket.id ];
        if ( user )
        {
            try
            {
                await User.updateOne( { username: user.username }, { status: 0 } );
                console.log( `${ user.username } has disconnected and is now offline.` );

                const remainingUsers = ChatService.removeUser( socket.id );

                // Broadcast the updated user list to all remaining clients
                const allDbUsers = await User.find( {}, 'username email role status' );
                io.emit( "allUserList", allDbUsers );
                io.emit( "groupList", ChatService.getAllGroups() );
            } catch ( error )
            {
                console.error( `Error updating status for ${ user.username } on disconnect:`, error );
            }
        }
    } );
};

module.exports = registerChatSocket; 