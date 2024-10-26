import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs"
import crypto from "crypto";

import jwt from "jsonwebtoken";

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
        public_id: {
            type: "String",
        },
        secure_url: {
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

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods = {
    generateJWTToken: async function(){
        return await jwt.sign(
            { id: this._id, role: this.role, subscription: this.subscription },
            process.env.JWT_SECRET,
            {
              expiresIn: process.env.JWT_EXPIRY,
            });
    },
    comparePassword: async function(plainTextPassword) {
        return await bcrypt.compare(plainTextPassword, this.password)
    },
    generatePasswordResetToken: async function(){
        const resetToken = crypto.randomBytes(20).toString("hex");

        this.forgotPasswordToken = crypto.createHash("sha256")
        .update(resetToken)
        .digest('hex');

         // "sha256" algorithn

        this.forgotPasswordExpiry = Date.now() + 10 * 60 * 1000;

        return resetToken;
    }

}

const User = model("User", userSchema);

export default User;