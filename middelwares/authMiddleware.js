import jwt from "jsonwebtoken";
import AppError from "../utils/customError.js";
import asyncHandler from "./asyncHandlerMiddleware.js";


const isLoggedIn = asyncHandler(async (req, _res, next) => {
    // extracting token from the cookies
    const { token } = req.cookies;
    console.log(token);
  
    // If no token send unauthorized message
    if (!token) {
      return next(new AppError("Unauthorized, please login to continue", 401));
    }
  
    // Decoding the token using jwt package verify method
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  
    // If no decode send the message unauthorized
    if (!decoded) {
      return next(new AppError("Unauthorized, please login to continue", 401));
    }
  
    // If all good store the id in req object, here we are modifying the request object and adding a custom field user in it
    req.user = decoded;
  
    // Do not forget to call the next other wise the flow of execution will not be passed further
    next();
  });

const authorizedRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError("You are not authorized to perform this action", 403));
        }
        next();
    };
};

const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id); // Adjust to match your User model
        if (!req.user) {
            return res.status(404).json({ message: "User not found" });
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};

export { isLoggedIn, authorizedRoles, authenticate};
