const jwt = require ('jsonwebtoken')

const isAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({message: 'authorization header missing or malformed'})
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded;
        next();        
    } catch (err) {
        console.error('error verifying tokrn:', err)
        return res.status(401).json({message: 'invalid or expired token'})
    }
};



module.exports = isAuth;