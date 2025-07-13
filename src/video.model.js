const mongoose= require('mongoose');
const mongooseaggregate= require('mongoose-aggregate-paginate-v2')
const videoSchema= new mongoose.Schema({

videofile:{
    type:String,
    required:true
},
thumbnail:{
    type:String
},
title:{
    type:String,
        required:true
},
despription:{
    type:String,
        required:true
},
view:{
    type:Number,
    default:0
},
owner:{
    type: Schema.Types.ObjectId,
    ref:"User"
}



},{timestamps:true})


videoSchema.plugin(mongooseaggregate)
const Video = mongoose.model("Video",videoSchema)