import { IUser } from "./user.interface";
import User from "./user.model";
import AppError from "../../errors/appError";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import Tutor from "../tutor/tutor.model";
import { Student } from "../student/student.model";

const registerUser = async (userData: IUser) => {
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
            const tutorCreated = await tutor.save({ session });

            await session.commitTransaction();

            return tutorCreated;
        } else if (userData?.role === "student") {
            const studentData = {
                name: userData?.name,
                email: userData?.email,
                user: createdUser?._id,
            };
            const student = new Student(studentData);
            const studentCreated = await student.save({ session });

            await session.commitTransaction();

            return studentCreated;
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

export const UserServices = {
    registerUser,
};
