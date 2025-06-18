const Joi = require( 'joi' );

exports.register = ( req, res, next ) => {
    const schema = Joi.object( {
        username: Joi.string().required(),
        email: Joi.string().email( { minDomainSegments: 2, tlds: { allow: [ 'com', 'net', 'in' ] } } ).required(),
        password: Joi.string().min( 6 ).required()
    } )

    const { error } = schema.validate( req.body );
    if ( error ) return res.status( 400 ).json( { error: error.details[ 0 ].message } )
    next()
}

exports.login = ( req, res, next ) => {
    const schema = Joi.object( {
        email: Joi.string().email().required(),
        password: Joi.string().required()
    } )

    const { error } = schema.validate( req.body );
    if ( error ) return res.status( 400 ).json( { error: error.details[ 0 ].message } )
    next()
}
