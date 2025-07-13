import mongoose from "mongoose"


const UsersSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    }
}, { timestamps: true });


export const user = mongoose.Model('user', UsersSchema) 