import Course from "../models/course.model.js";
import AppError from "../utils/customError.js";
import cloudinary from "cloudinary";
import fs from "fs";

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
        return next(new AppError("Invalid course id"));
    }

    res.status(200).json({
        success: true,
        message: "Course lectures fetched successfully!",
        lectures: course.lectures,
    })
}

const createCourse = async (req, res, next) => {
    const { title, description, category, createdBy } = req.body;

    if (!title || !description || !category || !createdBy) {
        return next(new AppError("All fields are required!", 500));
    }

    try {
        const course = new Course({
            title,
            description,
            category,
            createdBy,
            thumbnail: {
                public_id: "",
                secure_url: ""
            }
        });

        if (req.file) {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: "lms"
            });

            if (result) {
                course.thumbnail.public_id = result.public_id;
                course.thumbnail.secure_url = result.secure_url;
            }

            fs.rmSync(`uploads/${req.file.filename}`);
        }

        await course.save();

        res.status(200).json({
            success: true,
            message: "Course created successfully!",
            course,
        });

        if(!course){
            return next(new AppError("Course with given id does not exists", 500))
        }

        res.status(200).json({
            success: true,
            message: "Course updated successfully!",
            lectures: course.lectures,
        })

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

const updateCourse = async (req, res, next) => {
    try {
        const { id } = req.params;

        const course = await Course.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!course) {
            return next(new AppError("Course not found", 404));
        }

        res.status(200).json({
            success: true,
            data: course,
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};



const removeCourse = async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);

        if (!course) {
            return next(new AppError("Course with the given ID does not exist", 404));
        }

        await Course.deleteOne({ _id: id }); // or `await Course.findByIdAndDelete(id);`

        res.status(200).json({
            success: true,
            message: "Course deleted successfully!",
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};





export {
    getAllCourses,
    getLecturesByCourseId,
    createCourse,
    updateCourse,
    removeCourse

}