import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/appError";
import { IJwtPayload } from "../auth/auth.interface";
import Tutor from "../tutor/tutor.model";
import { IBooking, IStatus } from "./booking.interface";
import Booking from "./booking.model";
import Subject from "../subject/subject.model";
import { Student } from "../student/student.model";
import { canChangeBookingStatus } from "./booking.utils";

const createBookingIntoDB = async (
    payload: IBooking,
    authUser: IJwtPayload
) => {
    const isStudentExists = await Student.findOne({ user: authUser?.userId });

    if (!isStudentExists) {
        throw new AppError(StatusCodes.NOT_FOUND, "Student not found!");
    }

    const isTutorExists = await Tutor.findById(payload?.tutor);

    if (!isTutorExists) {
        throw new AppError(StatusCodes.NOT_FOUND, "Tutor not found!");
    }

    if (!isTutorExists.hourlyRate || isTutorExists.hourlyRate <= 0) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            "Invalid hourly rate for the tutor!"
        );
    }

    const isSubjectExists = await Subject.findById(payload?.subject);

    if (!isSubjectExists) {
        throw new AppError(StatusCodes.NOT_FOUND, "Subject not found!");
    }

    if (!payload.duration || payload.duration <= 0) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            "Invalid duration! Duration must be greater than 0."
        );
    }

    payload.price = parseFloat(
        String(isTutorExists?.hourlyRate * (payload.duration / 60))
    );

    const result = await Booking.create(payload);

    return result;
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

    console.log(authUser?.role);

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

        booking.status = payload?.status;
        const result = await booking.save();

        return result;
    } else if (
        authUser?.role === "student" &&
        [IStatus.CANCELED_BY_STUDENT].includes(payload?.status)
    ) {
        const isStudentExists = await Student.findOne({ user: authUser?.userId });

        if (!isStudentExists) {
            throw new AppError(StatusCodes.NOT_FOUND, "Student not found!");
        }

        booking.status = payload?.status;
        const result = await booking.save();

        return result;
    } else {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized to change status");
    }
};



export const BookingServices = {
    createBookingIntoDB,
    changeBookingStatusIntoDB,
};
