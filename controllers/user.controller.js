import AppError from "../utils/customError";

const login = (req, res, next)=>{
    const {fulName, email, password} = req.body;

    if(!fulName || !email || !password){
        return next(new AppError("All fiels are required", 400));
    }
}

const register = (req, res)=>{

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
