const mongoose = require( 'mongoose' )

const userSchema = new mongoose.Schema( {
    username: {
        type: String,
        required: true
    },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    googleId: { type: String, unique: true, sparse: true },
    role: {
        type: String,
        enum: [ 'user', 'admin' ],
        default: 'user'
    },
    status: {
        type: Number,
        enum: [ 0, 1 ], // 0 = offline, 1 = online
        default: 0
    }
}, { timestamps: true } )

module.exports = mongoose.model( 'User', userSchema )