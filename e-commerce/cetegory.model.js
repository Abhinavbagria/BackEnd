import mongoose from "mongoose"


const CetegorySchema = new mongoose.Schema({

    username: {
        type: String,
        
    },
   
}, { timestamps: true });


export const Cetegory = mongoose.Model('Cetegory', CetegorySchema) 