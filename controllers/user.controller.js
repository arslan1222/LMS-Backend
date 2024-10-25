import User from "../models/user.model.js";
import AppError from "../utils/customError.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";

const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true
}

const register = async (req, res, next) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return next(new AppError("All fields are required", 400));
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        return next(new AppError("Email is already existed!", 400));
    }

    const user = await User.create({
        fullName,
        email,
        password,
        avatar: {
            public_id: email,
            secure_url: "https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg"
        }
    });

    if (!user) {
        return next(new AppError("User registration failed!", 400));
    }

    // logic for file upload to cloudinary 
    console.log("File is ", JSON.stringify(req.file));

    if (req.file) {
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: "lms",
                width: 250,
                height: 250,
                gravity: "faces",
                crop: "fill",
            });

            if (result) {
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url = result.secure_url;

                // remove file
                await fs.rm(`uploads/${req.file.filename}`);
            }
        } catch (error) {
            console.error("Cloudinary Error:", error);  // Log the error
            return next(new AppError(error.message || "File not uploaded, please try again", 500));
        }
    }

    await user.save();

    const token = await user.generateJWTToken();
    res.cookie("token", token, cookieOptions);

    res.status(201).json({
        success: true,
        message: "User registered successfully!",
        user,
    });
};


const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError("All fields are required", 400));
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user || !(await user.comparePassword(password))) {
            return next(new AppError("Email or Password is incorrect!", 400));
        }

        const token = await user.generateJWTToken();
        user.password = undefined;

        res.cookie("token", token, cookieOptions);

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};


const logout = (req, res)=>{
    res.cookie("token", null, {
        secure: true,
        maxAge: 0,
        httpOnly: true 
    });

    res.status(200).json({
        success: true,
        message: "User logged out!",
    });
}

const getProfile = async(req, res)=>{
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return next(new AppError("User not found!", 404));
        }

        res.status(200).json({
            success: true,
            message: "User details",
            user
        });
    } catch (error) {

        return next(new AppError("Failed to fetch profile details!"));

    }
}


export {
    register,
    login,
    logout,
    getProfile
}
