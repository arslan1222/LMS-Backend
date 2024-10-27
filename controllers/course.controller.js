import Course from "../models/course.model.js";
import AppError from "../utils/customError.js";

const getAllCourses = async (req, res, next)=>{

    try {
        const courses = await Course.find({}).select("-lectures");

        res.status(200).json({
            success: true,
            message: "All courses",
            courses,
        })
    } catch (error) {
        return next(new AppError(error.message, 500));
        
    }
    
}

const getLecturesByCourseId = async(req, res, next)=>{
    const {id} = req.params;

    const course = await Course.findById(id);

    if(!course){
        return next(new AppError("Invalid course id"))
    }

    res.status(200).json({
        success: true,
        message: "Course lectures fetched successfully!",
        lectures: course.lectures,
    })
}



export {
    getAllCourses,
    getLecturesByCourseId,
}