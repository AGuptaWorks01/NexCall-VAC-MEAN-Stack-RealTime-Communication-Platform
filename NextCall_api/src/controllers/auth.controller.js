const authService = require( '../services/auth.service' )

// Regular authentication functions
const register = async ( req, res ) => {
    try
    {
        const result = await authService.register( req.body )
        res.status( 201 ).json( result )
    } catch ( err )
    {
        const statusCode = err.status || 500;
        res.status( statusCode ).json( { message: err.message || 'Internal Server Error' } );
    }
}

const login = async ( req, res ) => {
    try
    {
        const result = await authService.login( req.body )
        res.status( 200 ).json( result )
    } catch ( err )
    {
        const statusCode = err.status || 401
        res.status( statusCode ).json( { message: err.message || 'Internal Server Error' } )
    }
}

const get = async ( req, res ) => {
    try
    {
        const result = await authService.getall( req.body )
        res.status( 200 ).json( result )
    } catch ( err )
    {
        res.status( 401 ).json( { error: err.message } )
    }
}

// Check authentication status
const checkAuthStatus = ( req, res ) => {
    if ( req.isAuthenticated() )
    {
        res.json( {
            isAuthenticated: true,
            user: req.user
        } );
    } else
    {
        res.json( {
            isAuthenticated: false
        } );
    }
};

module.exports = {
    register,
    login,
    get,
    checkAuthStatus
};