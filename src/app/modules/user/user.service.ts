import { IUser } from "./user.interface";
import User from "./user.model";
import AppError from "../../errors/appError";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import Tutor from "../tutor/tutor.model";
import { Student } from "../student/student.model";
import { IStudent } from "../student/student.interface";
import { ITutor } from "../tutor/tutor.interface";
import { AuthService } from "../auth/auth.service";
import { IJwtPayload } from "../auth/auth.interface";
import { IImageFile } from "../../interface/IImageFile";

const registerUserIntoDB = async (userData: IUser) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // Check if the user already exists by email
        const existingUser = await User.findOne({
            email: userData.email,
        }).session(session);

        if (existingUser) {
            throw new AppError(
                StatusCodes.NOT_ACCEPTABLE,
                "Email is already registered"
            );
        }

        // Create the user
        const user = new User(userData);
        const createdUser = await user.save({ session });

        // Create Role based Tutor or Student
        if (userData?.role === "tutor") {
            const tutorData = {
                name: userData?.name,
                email: userData?.email,
                user: createdUser?._id,
            };
            const tutor = new Tutor(tutorData);
            // Create Tutor
            await tutor.save({ session });

            await session.commitTransaction();

            return await AuthService.loginUser({
                email: userData?.email,
                password: userData?.password,
            });
        } else if (userData?.role === "student") {
            const studentData = {
                name: userData?.name,
                email: userData?.email,
                user: createdUser?._id,
            };
            const student = new Student(studentData);
            // Create Student
            await student.save({ session });

            await session.commitTransaction();

            return await AuthService.loginUser({
                email: userData?.email,
                password: userData?.password,
            });
        }
    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        throw error;
    } finally {
        session.endSession();
    }
};

const updateStudentProfileIntoDB = async (
    file: IImageFile,
    payload: Partial<IStudent>,
    authUser: IJwtPayload
) => {
    const isUserExists = await User.findById(authUser?.userId);

    if (!isUserExists) {
        throw new AppError(StatusCodes.NOT_FOUND, "User not found!");
    }

    if (!isUserExists.isActive) {
        throw new AppError(StatusCodes.BAD_REQUEST, "User is not active!");
    }

    if (file && file.path) {
        payload.profileUrl = file.path;
    }

    const result = await Student.findOneAndUpdate(
        {
            user: authUser?.userId,
        },
        payload,
        {
            new: true,
        }
    );

    return result;
};

const updateTutorProfileIntoDB = async (
    file: IImageFile,
    payload: Partial<ITutor>,
    authUser: IJwtPayload
) => {
    const isUserExists = await User.findById(authUser?.userId);

    if (!isUserExists) {
        throw new AppError(StatusCodes.NOT_FOUND, "User not found!");
    }

    if (!isUserExists.isActive) {
        throw new AppError(StatusCodes.BAD_REQUEST, "User is not active!");
    }

    if (file && file.path) {
        payload.profileUrl = file.path;
    }

    const result = await Tutor.findOneAndUpdate(
        {
            user: authUser?.userId,
        },
        payload,
        {
            new: true,
        }
    );

    return result;
};

export const UserServices = {
    registerUserIntoDB,
    updateStudentProfileIntoDB,
    updateTutorProfileIntoDB,
};
