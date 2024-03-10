const User = require("../models/userModels")
const bcrypt = require('bcryptjs');
const { calculateDistance } = require("../utills/distance");

exports.register = async (req, res) => {
    try {
        const { name, email, password, mobile } = req.body;
        if (!name || !email || !password || !mobile) {
            return res.status(422).json(
                { 
                    error : "Unprocessable Entity",
                    message: !name ? "name is required." : !email ? "email is required." : !mobile ? "mobile no. is required." : "password is required." 
                }
            )
        }
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.status(422).json(
                {
                    error : "Conflict",
                    message: "User with the provided email already exists."
                }
            )
        }
        let userName = email.split('@')[0];
        const user = new User({...req.body, userName});

        const newUser = await user.save();
        let token = await newUser.generateAuthToken();
        // console.log(token);
        res.status(200).json(
            { 
                success : true,
                message: "New user created successfully.", 
                user : newUser,
                token,
            }
        )
    } catch (error) {
        res.status(500).json(
            { 
                error: 'Internal Server Error', 
                message: error.message
            }
        );
    }

}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(422).json(
                { 
                    error : "Unprocessable Entity",
                    message: !email ? "email is required." : "password is required." 
                }
            )
        }
        const user = await User.findOne({ email }).select("+password");
        if(!user){
            return res.status(404).json(
                {
                    error : 'Not Found',
                    message: 'User not found.' 
                }
            )
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json(
                { 
                    error: 'Unauthorized', 
                    message: 'Invalid username or password.' 
                }
            );
        } else {
            let token = await user.generateAuthToken();
            res.status(200).json(
                { 
                    success : true,
                    message: "login successfull", 
                    user,
                    token,
                }
            )
        }   
    } catch (error) {
        res.status(500).json(
            { 
                error: 'Internal Server Error', 
                message: error.message
            }
        );
    }
}

exports.getUser = async (req, res) => {
    try {   
        res.status(200).json(
            { 
                success : true,
                message: "User retrieval successful", 
                user: req.user,
                token: req.token,
            }
        )
    } catch (error) {
        res.status(500).json(
            { 
                error: 'Internal Server Error', 
                message: error.message
            }
        );
    }
}

exports.updateUser = async (req, res)=>{
    try {
        const id = req.params.id;
        const data = req.body;
        const newUser = await User.findByIdAndUpdate(id, data);
        console.log(id, data);
        res.status(200).json(
            { 
                success : true,
                message: "user updated successfully.", 
                user : newUser,
            }
        )
    } catch (error) {
        res.status(500).json(
            { 
                error: 'Internal Server Error', 
                message: error.message
            }
        );
    }
}

exports.getAllUser = async (req, res) => {
    try {
        const query = req.query;
        const myId = req.user.id
        let filter = [{
            $match: {}
        }];
        console.log(query);

        if (query && query.name) {
            filter.push({
                $match: {
                    'name': { $regex: new RegExp(query.name, 'i') },
                },
            });
        }
        if (query && query.sport) {
            filter.push({
                $match: {
                    sports: {
                        $elemMatch: {
                            name: { $regex: new RegExp(query.sport, 'i') },
                        },
                    },
                },
            });
        }
        if (query && query.location) {
            filter.push({
                $match: {
                    'location.name': { $regex: new RegExp(query.location, 'i') },
                },
            });
        }

        let users = await User.aggregate(filter);
        
        if (query && query.distance) {
            if (req.user.location && req.user.location.lat && req.user.location.lon) {
                const userLat = req.user.location.lat;
                const userLon = req.user.location.lon;
                
                users.forEach(user => {
                    console.log(user._id);
                    const distance = calculateDistance(user.location.lat, user.location.lon, userLat, userLon);
                    user.distance = distance;
                });

                users = await users.filter((user)=>{return (user.distance <= query.distance && myId !=user._id) })
            } else {
                res.status(500).json({
                    error: 'Internal Server Error',
                    message: "update your location to explore this feature."
                });
            }
        }
        res.status(200).json({
            success: true,
            message: "All users retrieved successfully.",
            users,
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message,
        });
    }
};



