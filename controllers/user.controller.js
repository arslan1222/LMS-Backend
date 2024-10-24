import User from "../models/user.model.js";
import AppError from "../utils/customError.js";

const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true
}

const register = async (req, res, next)=>{
    const {fullName, email, password} = req.body;

    if(!fullName || !email || !password){
        return next(new AppError("All fields are required", 400));
    }

    const userExists = await User.findOne({email});

    if(userExists){
        return next(new AppError("Email is already existed!", 400));
    }

    const user = await User.create({
        fullName,
        email,
        password,
        avatar:{
            publicId: email,
            secureURL: "https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg"
        }
    });

    if(!user){
        return next(new AppError("User registration failed!", 400));
    }

    await user.save();

    const token = await user.generateJWTToken();

    res.cookie("token", token, cookieOptions);

    res.status(201).json({
        success: true,
        message: "User registerd succesfully!",
        user,
    });
}

const login = async (req, res)=>{
    try {
        if(!email || !password){
            return next(new AppError("All fiels are required", 400));
        }
        
        const user = await User.findOne({
            email
        }).select("+password");
    
        if(!user || !user.camparePassword(password)){
            return next(new AppError("Email or Password missing!", 400));
        }
    
        const token = await user.generateJWTToken();
        user.password = undefined;
    
        res.cookie("token", token, cookieOptions);
    
        res.status(200).json({
            success: true,
            message: "User logged in succesfully",
            user
        });
    } catch (error) {
        return next(new AppError(error.message,500));
    }
    
}

const logout = (req, res)=>{

}

const getProfile = (req, res)=>{

}


export {
    register,
    login,
    logout,
    getProfile
}
