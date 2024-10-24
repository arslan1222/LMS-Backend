import { Schema, model } from "mongoose";

const userSchema = new Schema({
    fullName: {
        type: 'String',
        minLength: [4, "name must be atleast 4 characters"],
        maxLength: [20, "Name should be less than 20 characters"],
        required: [true, "Name must be required"],
        lowercase: true,
        trim: true,
    },
    email:{
        type: "String",
        required: [true, "Email is required"],
        lowercase: true,
        trim: true,
        unique: true,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please fill in a valid email address',
        ]
    },
    password: {
        type: "String",
        minLength: 6,
        required: [true, "Passwor is requiresd"],
        select: false
    },
    avatar: {
        publicId: {
            type: "String",
        },
        secureURL: {
            type: "String"
        }  
    },
    role: {
        type: "String",
        enum: ["USER", "ADMIN"],
        default: "USER",
    },
    forgotPasswordToken: {
        type: "String",
    },
    forgotPasswordExpiry: Date,

}, {timestamps: true});

const User = model("User", userSchema);

export default User;