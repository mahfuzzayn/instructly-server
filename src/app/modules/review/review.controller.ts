import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ReviewServices } from "./review.service";
import { StatusCodes } from "http-status-codes";
import { IJwtPayload } from "../auth/auth.interface";

const giveReview = catchAsync(async (req: Request, res: Response) => {
    const result = await ReviewServices.giveReviewIntoDB(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Review given successfully!",
        data: result,
    });
});

const getSingleReview = catchAsync(async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    const result = await ReviewServices.getSingleReviewFromDB(reviewId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Review retrieved successfully!",
        data: result,
    });
});

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
    const result = await ReviewServices.getAllReviewsFromDB();

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Reviews retrieved successfully!",
        data: result,
    });
});

const getMyReviews = catchAsync(async (req: Request, res: Response) => {
    const result = await ReviewServices.getMyReviewsFromDB(
        req.user as IJwtPayload,
        req.query
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Reviews retrieved successfully!",
        data: result?.result,
        meta: result?.meta,
    });
});

// Admin Options
const changeReviewVisibilityByAdmin = catchAsync(
    async (req: Request, res: Response) => {
        const { reviewId } = req.params;
        const result = await ReviewServices.changeReviewVisibilityByAdminIntoDB(
            req.user as IJwtPayload,
            reviewId,
            req.body
        );

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Review visibilty changed successfully!",
            data: result,
        });
    }
);

export const ReviewController = {
    giveReview,
    getSingleReview,
    getAllReviews,
    getMyReviews,

    // Admin Options
    changeReviewVisibilityByAdmin,
};
