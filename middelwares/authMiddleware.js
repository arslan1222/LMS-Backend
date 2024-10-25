import AppError from "../utils/customError.js";

const isLoggedIn = (req, res, next)=>{
    const { token } = req.cookies;

    if(!token){
        return next( new AppError("Unauthenticated, please login again", 400));
    }

    const userDetails = jwt.verify(token, process.env.JWT_SECRET);

    req.user = userDetails;

    next();
}

export {
    isLoggedIn
}