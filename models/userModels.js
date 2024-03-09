const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Your Name"],
        
    },
    email:{
        type:String,
        required:[true,"Please Enter Your Email"],
        unique:true,
        validate:[validator.isEmail, "Please Enter a valid Email"]
    },
    userName:{
        type:String,
        required:true,
    },
    mobile:{
        type:String,
        required:[true,"Please Enter Your Mobile"],   
        unique:true,
    },
    password:{
        type:String,
        required:[true, "Please Enter your password"],
        select:false,
    },
    pic: {
        type : String,
        default : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
    
});

//hashing the password...
userSchema.pre('save',async function (next){
    if(this.isModified('password')){
        this.password =await bcrypt.hash(this.password, 12)
    }
    next();
});

// Generating token
userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
        await this.save();
        return token;
    } catch (error) {
        throw new Error(error);
    }
};

//  token to reset password
userSchema.methods.createPasswordResetToken = async function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10 minutes
    return resetToken;
};



const User = mongoose.model('user',userSchema);
module.exports=User;