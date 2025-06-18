const User = require( '../models/user.model' );
const Message = require( '../models/message.model' ); // Import message model
const { hasdPassword, comparePassword } = require( '../utils/hash' )
const { generateToken } = require( '../utils/jwt' )
// const { v4: uuidv4 } = require('uuid'); // You would add this line after npm install uuid

exports.register = async ( { username, email, password } ) => {
    const existingUser = await User.findOne( { email } )

    if ( existingUser )
    {
        const error = new Error( "User already exists" );
        error.status = 400;
        throw error;
    }

    const hashedPassword = await hasdPassword( password )
    const user = await User.create( { username, email, password: hashedPassword } )

    return {
        message: 'User registered successfully',
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        }
    };
}

exports.login = async ( { email, password } ) => {
    const user = await User.findOne( { email } );
    if ( !user )
    {
        const error = new Error( "Invalid email or password" );
        error.status = 401;
        throw error;
    }

    const isMatch = await comparePassword( password, user.password );
    if ( !isMatch )
    {
        const error = new Error( "Invalid email or password" );
        error.status = 401;
        throw error;
    }

    // Plain object for JWT
    const payload = {
        id: user._id.toString(),
        username: user.username,
        // jti: uuidv4() // Add JWT ID claim - uncomment and use uuid after installing
    };

    const token = generateToken( payload );

    return {
        message: "Login successful",
        token,
        user: payload
    };
};

exports.getChatHistory = async ( currentUserUsername, otherUserUsername ) => {
    const messages = await Message.find( {
        $or: [
            { from: currentUserUsername, to: otherUserUsername },
            { from: otherUserUsername, to: currentUserUsername }
        ]
    } ).sort( { timestamp: 'asc' } );

    return messages;
};

exports.getall = async () => {
    const user = await User.find();
    console.log( user );
    return { message: 'Get all', user };
}