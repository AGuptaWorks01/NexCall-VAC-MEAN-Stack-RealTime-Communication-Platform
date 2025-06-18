const socket = io();

// DOM Elements
const usernameInput = document.getElementById( "usernameInput" );
const registerButton = document.getElementById( "registerButton" );
const chatArea = document.getElementById( "chatArea" );

// Private Chat Elements
const userList = document.getElementById( "userList" );
const privateMessageInput = document.getElementById( "privateMessageInput" );
const privateSendButton = document.getElementById( "privateSendButton" );
const privateMessages = document.getElementById( "privateMessages" );

// Group Chat Elements
const groupList = document.getElementById( "groupList" );
const groupNameInput = document.getElementById( "groupNameInput" );
const createGroupButton = document.getElementById( "createGroupButton" );
const joinGroupButton = document.getElementById( "joinGroupButton" );
const leaveGroupButton = document.getElementById( "leaveGroupButton" );
const groupMessageInput = document.getElementById( "groupMessageInput" );
const groupSendButton = document.getElementById( "groupSendButton" );
const groupMessages = document.getElementById( "groupMessages" );

let selectedUserId = null;
let currentGroupId = null;

// Register user
registerButton.addEventListener( "click", () => {
    const username = usernameInput.value.trim();
    if ( !username ) return alert( "Enter your name" );

    socket.emit( "register", username );
    chatArea.style.display = "block";
    registerButton.disabled = true;
    usernameInput.disabled = true;
} );

// Update user list dropdown
socket.on( "userList", ( users ) => {
    userList.innerHTML = "";

    users.forEach( ( user ) => {
        if ( user.id !== socket.id )
        {
            const option = document.createElement( "option" );
            option.value = user.id;
            option.textContent = user.username;
            userList.appendChild( option );
        }
    } );

    if ( userList.options.length > 0 )
    {
        selectedUserId = userList.value;
    }
} );

// Update group list
socket.on( "groupList", ( groups ) => {
    groupList.innerHTML = "";
    groups.forEach( ( group ) => {
        const option = document.createElement( "option" );
        option.value = group.id;
        option.textContent = `${ group.name } (${ group.memberCount } members)`;
        groupList.appendChild( option );
    } );
} );

// Handle dropdown changes
userList.addEventListener( "change", () => {
    selectedUserId = userList.value;
} );

groupList.addEventListener( "change", () => {
    currentGroupId = groupList.value;
} );

// Create group
createGroupButton.addEventListener( "click", () => {
    const groupName = groupNameInput.value.trim();
    if ( !groupName ) return alert( "Enter a group name" );

    socket.emit( "create group", groupName );
    groupNameInput.value = "";
} );

// Join/Leave group
joinGroupButton.addEventListener( "click", () => {
    if ( !currentGroupId ) return alert( "Select a group to join" );
    socket.emit( "join group", currentGroupId );
} );

leaveGroupButton.addEventListener( "click", () => {
    if ( !currentGroupId ) return alert( "Select a group to leave" );
    socket.emit( "leave group", currentGroupId );
} );

// Send private message
privateSendButton.addEventListener( "click", () => {
    const message = privateMessageInput.value.trim();
    if ( !message || !selectedUserId ) return;

    socket.emit( "private message", {
        to: selectedUserId,
        message,
    } );

    // Show in sender's chat box
    const li = document.createElement( "li" );
    li.textContent = `You: ${ message }`;
    privateMessages.appendChild( li );
    privateMessages.scrollTop = privateMessages.scrollHeight;
    privateMessageInput.value = "";
} );

// Send group message
groupSendButton.addEventListener( "click", () => {
    const message = groupMessageInput.value.trim();
    if ( !message || !currentGroupId ) return;

    socket.emit( "group message", {
        groupId: currentGroupId,
        message,
    } );
    groupMessageInput.value = "";
} );

// Receive private message
socket.on( "private message", ( { from, message } ) => {
    const li = document.createElement( "li" );
    li.textContent = `${ from }: ${ message }`;
    privateMessages.appendChild( li );
    privateMessages.scrollTop = privateMessages.scrollHeight;
} );

// Receive group message
socket.on( "group message", ( message ) => {
    const li = document.createElement( "li" );
    if ( message.type === "system" )
    {
        li.classList.add( "system" );
        li.textContent = message.message;
    } else
    {
        li.textContent = `${ message.from }: ${ message.message }`;
    }
    groupMessages.appendChild( li );
    groupMessages.scrollTop = groupMessages.scrollHeight;
} );
