import mongoose from 'mongoose'


const productSchema = new mongoose.Schema({
description:String,
name:String,
productimage:String,
price:{
    required:true,
    type:number
},
cetegory:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Cetegory" 
}

},{timestamps:true});


export const Product= mongoose.Model('Product',productSchema)