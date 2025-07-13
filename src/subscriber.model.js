const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const subscriberSchema = new mongoose.Schema({

    channel:{
       type: Schema.Types.ObjectId,
    ref:"User"
    },
    subscriber:{
         type: Schema.Types.ObjectId,
    }
},{timestamps:true})

const Subscribers= mongoose.model("Subscribers", subscriberSchema);

module.exports = Subscribers