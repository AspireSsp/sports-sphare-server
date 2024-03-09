
const jwt = require('jsonwebtoken');
const User = require('../models/userModels');

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        // Check if the token exists
        if (!token) {
            throw new Error('No token found');
        }
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        const rootUser = await User.findOne({ _id: verifyToken._id });
        if (!rootUser) {
            throw new Error('User not found');
        }
        // Attach the token, user, and user ID to the request object
        req.token = token;
        req.user = rootUser;
        req.userId = rootUser._id;
        next();
    } catch (error) {
        res.status(401).send({ message: "Unauthorized" });
    }
};

// const authenticate = async (req, res, next)=>{
//         try {
//             const token = req.cookies
//             console.log(token);
//             const verifyToken = jwt.verify(token.jwttoken, process.env.JWT_SECRET);
//             console.log(verifyToken);
//             const rootUser = await User.findOne({ _id: verifyToken._id});
//             if(!rootUser) {throw new Error('User not Found')}

//             req.token = token;
//             req.rootUser = rootUser;
//             req.userId = rootUser._id;

//         next();
//         } catch (error) {
//             res.status(400).send({message : "no cookie found"});
//         }
        
    
// }

module.exports = authenticate;
