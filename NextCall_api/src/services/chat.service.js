const ChatService = {
    users: {},
    usernameToSocketId: {},
    groups: {},

    addUser ( socketId, user ) {
        this.users[ socketId ] = user;
        this.usernameToSocketId[ user.username ] = socketId;
        return this.getAllUsers();
    },

    removeUser ( socketId ) {
        const user = this.users[ socketId ];
        if ( user )
        {
            delete this.usernameToSocketId[ user.username ];
            delete this.users[ socketId ];
        }
        return this.getAllUsers();
    },

    getAllUsers () {
        return Object.entries( this.users ).map( ( [ id, u ] ) => ( { id, username: u.username } ) );
    },

    createGroup ( groupName, creatorSocketId ) {
        const groupId = `group_${ Date.now() }`;
        this.groups[ groupId ] = {
            id: groupId,
            name: groupName,
            members: [ creatorSocketId ],
            messages: []
        };
        return this.groups[ groupId ];
    },

    joinGroup ( groupId, socketId ) {
        if ( this.groups[ groupId ] && !this.groups[ groupId ].members.includes( socketId ) )
        {
            this.groups[ groupId ].members.push( socketId );
            return true;
        }
        return false;
    },

    leaveGroup ( groupId, socketId ) {
        if ( this.groups[ groupId ] )
        {
            this.groups[ groupId ].members = this.groups[ groupId ].members.filter( id => id !== socketId );
            return true;
        }
        return false;
    },

    getAllGroups () {
        return Object.values( this.groups ).map( ( { id, name, members } ) => ( {
            id,
            name,
            memberCount: members.length
        } ) );
    },

    addMessageToGroup ( groupId, message ) {
        if ( this.groups[ groupId ] )
        {
            this.groups[ groupId ].messages.push( message );
            return true;
        }
        return false;
    },

    getGroupMembers ( groupId ) {
        return this.groups[ groupId ]?.members || [];
    },

    deleteGroup ( groupId ) {
        if ( this.groups[ groupId ] )
        {
            delete this.groups[ groupId ];
            return true;
        }
        return false;
    }
};

module.exports = ChatService; 