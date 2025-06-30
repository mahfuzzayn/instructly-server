import mongoose, { Types } from "mongoose";
import { IReview } from "./review.interface";
import Review from "./review.model";
import { Student } from "../student/student.model";
import AppError from "../../errors/appError";
import { StatusCodes } from "http-status-codes";
import Tutor from "../tutor/tutor.model";
import { IJwtPayload } from "../auth/auth.interface";
import User from "../user/user.model";
import QueryBuilder from "../../builder/QueryBuilder";

const calculateTutorAverageReview = async (tutorId: Types.ObjectId) => {
    const result = await Review.aggregate([
        {
            $match: { tutor: new mongoose.Types.ObjectId(tutorId) },
        },
        {
            $group: {
                _id: null,
                averageRating: { $avg: "$rating" },
                reviewCount: { $sum: 1 },
            },
        },
    ]);

    if (result.length === 0) {
        return { averageRating: 0, reviewCount: 0 };
    }

    return {
        averageRating: result[0].averageRating.toFixed(1) || 0,
        reviewCount: result[0].reviewCount || 0,
    };
};

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

        const { averageRating } = await calculateTutorAverageReview(tutor?._id);

        tutor.averageRating = averageRating;
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
    const review = await Review.findById(id).populate({
        path: "student tutor",
        populate: "user",
    });

    if (!review) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            "No review were found by the provided ID!"
        );
    }

    return review;
};

const getAllReviewsFromDB = async (query: Record<string, unknown>) => {
    const reviewsQuery = new QueryBuilder(
        Review.find().populate({
            path: "student tutor",
            populate: "user",
        }),
        query
    )
        .sort()
        .paginate()
        .fields();
    const reviews = await reviewsQuery.modelQuery;
    const meta = await reviewsQuery.countTotal();

    if (!reviews) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            "No reviews were found by the student ID!"
        );
    }

    return {
        meta,
        result: reviews,
    };
};

const getMyReviewsFromDB = async (
    authUser: IJwtPayload,
    query: Record<string, unknown>
) => {
    if (authUser?.role === "student") {
        const user = await User.findById(authUser?.userId);

        if (!user) {
            throw new AppError(StatusCodes.NOT_FOUND, "No reviews were found!");
        }

        const student = await Student.findOne({ user: user?._id });

        if (!student) {
            throw new AppError(
                StatusCodes.NOT_FOUND,
                "No reviews were found by the student ID!"
            );
        }

        const reviewsQuery = new QueryBuilder(
            Review.find({ student: student?._id, isVisible: true }).populate({
                path: "student tutor",
                populate: "user",
            }),
            query
        )
            .sort()
            .paginate()
            .fields();
        const reviews = await reviewsQuery.modelQuery;
        const meta = await reviewsQuery.countTotal();

        if (!reviews) {
            throw new AppError(
                StatusCodes.NOT_FOUND,
                "No reviews were found by the student ID!"
            );
        }

        return {
            meta,
            result: reviews,
        };
    } else if (authUser?.role === "tutor") {
        const user = await User.findById(authUser?.userId);

        if (!user) {
            throw new AppError(StatusCodes.NOT_FOUND, "No reviews were found!");
        }
        const tutor = await Tutor.findOne({ user: authUser?.userId });

        if (!tutor) {
            throw new AppError(
                StatusCodes.NOT_FOUND,
                "No reviews were found by the tutor ID!"
            );
        }

        const reviewsQuery = new QueryBuilder(
            Review.find({ tutor: tutor?._id, isVisible: true }).populate({
                path: "student tutor",
                populate: "user",
            }),
            query
        )
            .sort()
            .paginate()
            .fields();

        const reviews = await reviewsQuery.modelQuery;
        const meta = await reviewsQuery.countTotal();

        if (!reviews) {
            throw new AppError(
                StatusCodes.NOT_FOUND,
                "No reviews were found by the tutor ID!"
            );
        }

        return {
            meta,
            result: reviews,
        };
    }
};

// Admin Services
const changeReviewVisibilityByAdminIntoDB = async (
    authUser: IJwtPayload,
    reviewId: string,
    payload: Partial<IReview>
) => {
    const review = await Review.findById(reviewId);

    if (!review) {
        throw new AppError(StatusCodes.NOT_FOUND, "Review not found.");
    }

    const { tutor, student, rating, comment, ...filteredPayload } = payload;

    const updatedData: any = {
        ...filteredPayload,
    };

    const updatedReview = await Review.findOneAndUpdate(
        { _id: reviewId },
        updatedData,
        { new: true }
    );

    return updatedReview;
};

export const ReviewServices = {
    giveReviewIntoDB,
    getSingleReviewFromDB,
    getAllReviewsFromDB,
    getMyReviewsFromDB,

    // Admin Services
    changeReviewVisibilityByAdminIntoDB,
};
