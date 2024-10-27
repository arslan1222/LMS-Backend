import {model, Schema } from "mongoose";

const courseSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        minLegth: [8, "Title must be atleast 8 characters"],
        maxLegth: [100, "Title must be less than 100 characters"],
    },
    description:{
        type: String,
        required: [true, "Description is required"],
        minLegth: [8, "Description must be atleast 8 characters"],
        maxLegth: [],

    },
    category: {
        type: String,
        required: [true, "Category is required"],
    },
    thumbnail: {
        public_id: {
            type: String,
            required: true
        },
        secure_url: {
            type: String,
            required: true
        },
    },
    lectures: [
        {
            title: String,
            description: String,
            lecture: {
                public_id: {
                    type: String,
                    required: true
                },
                secure_url: {
                    type: String,
                    required: true
                },
            }
        }
    ],
    numberOfLectures: {
        type: Number,
        default: 0,
    },
    createdBy: {
        type: String,
        required: true,
    }
},{timestamps: true});


const Course = model("Course", courseSchema);


export default Course;