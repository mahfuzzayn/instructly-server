import mongoose, { Types } from "mongoose";
import { IReview } from "./review.interface";
import Review from "./review.model";
import { Student } from "../student/student.model";
import AppError from "../../errors/appError";
import { StatusCodes } from "http-status-codes";
import Tutor from "../tutor/tutor.model";

const giveReviewIntoDB = async (payload: IReview) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const student = await Student.findById(payload?.student);

        if (!student) {
            throw new AppError(StatusCodes.NOT_FOUND, "Student not found!");
        }

        const tutor = await Tutor.findById(payload?.tutor);

        if (!tutor) {
            throw new AppError(StatusCodes.NOT_FOUND, "Tutor not found!");
        }

        const reviewCreated = new Review(payload);
        await reviewCreated.save({ session });

        student.reviewsGiven.push(reviewCreated?._id);
        await student.save({ session });

        tutor.reviews.push(reviewCreated?._id);
        await tutor.save({ session });

        await session.commitTransaction();

        return reviewCreated;
    } catch (error) {
        await session.abortTransaction();

        console.log(error);
    } finally {
        await session.endSession();
    }
};

const getSingleReviewFromDB = async (id: string) => {
    const result = await Review.findById(id);

    return result;
};

const getAllReviewsFromDB = async () => {
    const result = await Review.find();

    return result;
};

export const ReviewServices = {
    giveReviewIntoDB,
    getSingleReviewFromDB,
    getAllReviewsFromDB,
};
