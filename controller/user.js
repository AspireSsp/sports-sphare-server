const User = require("../models/userModels")
const bcrypt = require('bcryptjs');

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
