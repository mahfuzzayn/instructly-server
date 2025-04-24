import SSLCommerzPayment from "sslcommerz-lts";
import config from "../../config";
import mongoose from "mongoose";
import Booking from "../booking/booking.model";
import AppError from "../../errors/appError";
import { StatusCodes } from "http-status-codes";
import { IStatus } from "../booking/booking.interface";
import Tutor from "../tutor/tutor.model";
import { Student } from "../student/student.model";

// Store Information
const store_id = config.ssl.store_id as string;
const store_passwd = config.ssl.store_pass as string;
const is_live = false;

const validatePaymentService = async (tran_id: string) => {
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        //@ts-ignore
        const validationResponse = await sslcz.transactionQueryByTransactionId({
            tran_id,
        });

        // console.log(validationResponse.element);

        let data: {
            status: "pending" | "completed" | "canceled";
            gatewayResponse: any;
        };

        if (
            validationResponse.element[0].status === "VALID" ||
            validationResponse.element[0].status === "VALIDATED"
        ) {
            data = {
                status: "completed",
                gatewayResponse: validationResponse.element[0],
            };
        } else if (
            validationResponse.element[0].status === "INVALID_TRANSACTION"
        ) {
            data = {
                status: "canceled",
                gatewayResponse: validationResponse.element[0],
            };
        } else {
            data = {
                status: "pending",
                gatewayResponse: validationResponse.element[0],
            };
        }

        // Step-1: Updated Booking
        // Step-2: Updated Tutor Earnings
        const booking = await Booking.findOne({ transactionId: tran_id });

        if (!booking) {
            throw new AppError(StatusCodes.NOT_FOUND, "Booking not found!");
        }

        booking.status =
            data.status === "completed"
                ? IStatus.COMPLETED
                : IStatus.WAITING_FOR_PAYMENT;
        booking.paymentStatus = data.status;

        await booking.save({ session });

        const tutor = await Tutor.findById(booking.tutor);

        if (!tutor) {
            throw new AppError(StatusCodes.NOT_FOUND, "Tutor not found!");
        }

        if (
            booking.status === IStatus.COMPLETED &&
            booking.paymentStatus === "completed"
        ) {
            tutor.earnings += booking.price;
            await tutor.save({ session });
        }

        await session.commitTransaction();

        return true;
    } catch (error) {
        await session.abortTransaction();

        console.error(error);
        return false;
    } finally {
        session.endSession();
    }
};

export const SSLServices = {
    validatePaymentService,
};
