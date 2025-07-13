const mongoose = require("mongoose")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ACCESS_TOKEN_SECRET = "ABHINAV_";
const ACCESS_TOKEN_EXPIRY = "1h";
const REFRESH_TOKEN_SECRET = "JAAT_RAAJ";
const REFRESH_TOKEN_EXPIRY = "10d"


const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        lowercase: true
    },
    password: {
        type: String,
        // required: [true, "password to be must"],

    },
    avatar: {
        type: String
    },
    coverimage: {
        type: String
    },
    refreshtoken: {
        type: String
    },
    channnelName:{
        type: String
    }
}, { timestamps: true,
     strict: false 
 }

);

// middleware
userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.ispasswordcorrect = async function (password) {

    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        ACCESS_TOKEN_SECRET,
        {
            expiresIn: ACCESS_TOKEN_EXPIRY
        }
    )


}


userSchema.methods.generateRefreshToken = function () { // we have made this function later on we will call this function in indexjs to generate keys 
    // jwtsign only need 3 things data,token,expiry 
    return jwt.sign({
        _id: this._id
    },
        REFRESH_TOKEN_SECRET,
        {
            expiresIn: REFRESH_TOKEN_EXPIRY
        }


    )


}

const User = mongoose.model("User", userSchema)

module.exports = User