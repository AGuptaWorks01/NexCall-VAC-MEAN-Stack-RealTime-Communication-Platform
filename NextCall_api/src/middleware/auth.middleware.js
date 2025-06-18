// const { verifyToken } = require('../utils/jwt');

// module.exports = (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1]
//     if (!token) return res.status(401).json({ error: 'Access denied' });

//     try
//     {
//         const decoded = verifyToken(token)
//         req.user = decoded
//         next()
//     } catch
//     {
//         return res.status(403).json({ error: 'Invalid or expired token' });
//     }
// }