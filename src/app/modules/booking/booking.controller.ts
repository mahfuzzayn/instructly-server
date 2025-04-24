import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BookingServices } from "./booking.service";
import { IJwtPayload } from "../auth/auth.interface";
import { StatusCodes } from "http-status-codes";

const createBooking = catchAsync(async (req: Request, res: Response) => {
    const result = await BookingServices.createBookingIntoDB(
        req.body,
        req.user as IJwtPayload
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Booking created successfully!",
        data: result,
    });
});

const changeBookingStatus = catchAsync(async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    const result = await BookingServices.changeBookingStatusIntoDB(
        bookingId,
        req.body,
        req.user as IJwtPayload
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Booking status changed successfully!",
        data: result,
    });
});

export const BookingController = { createBooking, changeBookingStatus };
