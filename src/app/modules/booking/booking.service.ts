import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/appError";
import { IJwtPayload } from "../auth/auth.interface";
import Tutor from "../tutor/tutor.model";
import { IAvailability, IBooking, IStatus } from "./booking.interface";
import Booking from "./booking.model";
import { Student } from "../student/student.model";
import { canChangeBookingStatus, generateTransactionId } from "./booking.utils";
import config from "../../config";
import SSLCommerzPayment from "sslcommerz-lts";
import mongoose from "mongoose";
import moment from "moment";

const createBookingIntoDB = async (
    payload: IBooking,
    authUser: IJwtPayload
) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const student = await Student.findOne({ user: authUser?.userId });

        if (!student) {
            throw new AppError(StatusCodes.NOT_FOUND, "Student not found!");
        }

        const tutor = await Tutor.findById(payload?.tutor);

        if (!tutor) {
            throw new AppError(StatusCodes.NOT_FOUND, "Tutor not found!");
        }

        if (!tutor.hourlyRate || tutor.hourlyRate <= 0) {
            throw new AppError(
                StatusCodes.BAD_REQUEST,
                "Invalid hourly rate for the tutor!"
            );
        }

        if (!payload.timeSlots || payload.timeSlots.length <= 0) {
            throw new AppError(
                StatusCodes.BAD_REQUEST,
                "Time slots are required!"
            );
        }

        const tutorAvailability = tutor.availability;

        const availabilityTimes = payload.timeSlots.map(
            (slotId: IAvailability) => {
                const slot = tutorAvailability.find(
                    (availability) =>
                        availability._id.toString() === slotId.toString()
                );

                if (slot) {
                    return {
                        startTime: slot.startTime,
                        endTime: slot.endTime,
                        day: slot.day,
                        totalHours: slot.totalHours,
                    };
                }

                throw new AppError(
                    StatusCodes.NOT_FOUND,
                    `Time slot with ID ${slotId} not found in tutor availability!`
                );
            }
        );

        const weeklyHours = availabilityTimes.reduce((total: number, slot) => {
            const start = moment(slot.startTime, "HH:mm");
            const end = moment(slot.endTime, "HH:mm");
            const durationInHours = end.diff(start, "minutes") / 60;
            return total + durationInHours;
        }, 0);

        if (weeklyHours <= 0) {
            throw new AppError(
                StatusCodes.BAD_REQUEST,
                "Total time for the booking is invalid!"
            );
        }

        const totalHoursPerMonth = weeklyHours * 4;
        const months = payload.months || 0;

        if (months <= 0) {
            throw new AppError(
                StatusCodes.BAD_REQUEST,
                "Months for the booking is invalid!"
            );
        }

        const totalHours = totalHoursPerMonth * months;

        if (totalHours <= 0) {
            throw new AppError(
                StatusCodes.BAD_REQUEST,
                "Total hours for the booking is invalid!"
            );
        }

        payload.totalHours = totalHours;
        payload.price = parseFloat(String(tutor?.hourlyRate * totalHours));
        payload.timeSlots = availabilityTimes;

        const bookingCreated = new Booking(payload);
        bookingCreated.student = student?._id;
        await bookingCreated.save({ session });

        student.bookingHistory.push(bookingCreated?._id);
        await student.save({ session });

        await session.commitTransaction();

        return bookingCreated;
    } catch (error) {
        await session.abortTransaction();
        console.log(error);
        throw new AppError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Error occurred while creating booking."
        );
    } finally {
        await session.endSession();
    }
};

const getSingleBookingFromDB = async (id: string) => {
    const booking = await Booking.findById(id);

    if (!booking) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            "No booking found by the provided id!"
        );
    }

    return booking;
};

const getMyBookingsFromDB = async (authUser: IJwtPayload) => {
    if (authUser?.role === "tutor") {
        const tutor = await Tutor.findOne({ user: authUser?.userId });

        if (!tutor) {
            throw new AppError(StatusCodes.NOT_FOUND, "Tutor not found!");
        }

        const bookings = await Booking.find({ tutor: tutor?._id });

        if (!bookings) {
            throw new AppError(
                StatusCodes.NOT_FOUND,
                "You don't have any bookings yet!"
            );
        }

        return bookings;
    } else if (authUser?.role === "student") {
        const student = await Student.findOne({ user: authUser?.userId });

        if (!student) {
            throw new AppError(StatusCodes.NOT_FOUND, "Student not found!");
        }

        const bookings = await Booking.find({ student: student?._id });

        if (!bookings) {
            throw new AppError(
                StatusCodes.NOT_FOUND,
                "You didn't made any bookings yet!"
            );
        }

        return bookings;
    }

    return null;
};

const changeBookingStatusIntoDB = async (
    id: string,
    payload: Pick<IBooking, "status">,
    authUser: IJwtPayload
) => {
    const booking = await Booking.findById(id);

    if (!booking) {
        throw new AppError(StatusCodes.NOT_FOUND, "Booking not found!");
    }

    if (!canChangeBookingStatus(booking.status, payload.status)) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            "Invalid status transition."
        );
    }

    if (
        authUser?.role === "tutor" &&
        [IStatus.WAITING_FOR_PAYMENT, IStatus.CANCELED_BY_TUTOR].includes(
            payload?.status
        )
    ) {
        const isTutorExists = await Tutor.findOne({ user: authUser?.userId });

        if (!isTutorExists) {
            throw new AppError(StatusCodes.NOT_FOUND, "Tutor not found!");
        }

        if (payload.status === IStatus.CANCELED_BY_TUTOR) {
            booking.status = payload?.status;
            booking.paymentStatus = "canceled";
            const result = await booking.save();

            return result;
        } else {
            booking.status = payload?.status;
            const result = await booking.save();

            return result;
        }
    } else if (
        authUser?.role === "student" &&
        [IStatus.CANCELED_BY_STUDENT].includes(payload?.status)
    ) {
        const isStudentExists = await Student.findOne({
            user: authUser?.userId,
        });

        if (!isStudentExists) {
            throw new AppError(StatusCodes.NOT_FOUND, "Student not found!");
        }

        if (payload.status === IStatus.CANCELED_BY_STUDENT) {
            booking.status = payload?.status;
            booking.paymentStatus = "canceled";
            const result = await booking.save();

            return result;
        }

        return null;
    } else {
        throw new AppError(
            StatusCodes.UNAUTHORIZED,
            "Unauthorized to change status"
        );
    }
};

// Store Information
const store_id = config.ssl.store_id as string;
const store_passwd = config.ssl.store_pass as string;
const is_live = false;

const initiatePaymentFromDB = async (
    bookingId: string,
    authUser: IJwtPayload
) => {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new AppError(StatusCodes.NOT_FOUND, "Booking not found!");
    }

    if (
        booking.status !== IStatus.WAITING_FOR_PAYMENT ||
        booking.paymentStatus !== "pending"
    ) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            `Failed to initiate payment! Booking status: ${booking.status}.`
        );
    }

    const total_amount = booking.price;
    const tran_id = generateTransactionId();

    // Storing TransactionId on Booking
    booking.transactionId = tran_id;
    await booking.save();

    const data = {
        total_amount,
        currency: "BDT",
        tran_id,
        success_url: `${config.ssl.validation_url}?tran_id=${tran_id}`,
        fail_url: config.ssl.failed_url as string,
        cancel_url: config.ssl.cancel_url as string,
        shipping_method: "Courier",
        product_name: "N/A",
        product_category: "N/A",
        product_profile: "general",
        cus_name: "N/A",
        cus_email: "N/A",
        cus_add1: "Dhaka",
        cus_add2: "Dhaka",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: "01711111111",
        cus_fax: "01711111111",
        ship_name: "N/A",
        ship_add1: "Dhaka",
        ship_add2: "Dhaka",
        ship_city: "Dhaka",
        ship_state: "Dhaka",
        ship_postcode: 1000,
        ship_country: "Bangladesh",
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

    try {
        const apiResponse = await sslcz.init(data);

        const GatewayPageURL = apiResponse.GatewayPageURL;

        if (GatewayPageURL) {
            return GatewayPageURL;
        } else {
            throw new AppError(
                StatusCodes.BAD_GATEWAY,
                "Failed to generate payment gateway URL."
            );
        }
    } catch (error) {
        throw new AppError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "An error occurred while processing payment."
        );
    }
};

export const BookingServices = {
    createBookingIntoDB,
    getSingleBookingFromDB,
    getMyBookingsFromDB,
    changeBookingStatusIntoDB,
    initiatePaymentFromDB,
};
