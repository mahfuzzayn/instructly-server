import { IUser } from "./user.interface";
import User from "./user.model";
import AppError from "../../errors/appError";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import Tutor from "../tutor/tutor.model";
import { Student } from "../student/student.model";
import { IStudent } from "../student/student.interface";
import { DaysOfWeek, ITutor } from "../tutor/tutor.interface";
import { AuthService } from "../auth/auth.service";
import { IJwtPayload } from "../auth/auth.interface";
import { IImageFile } from "../../interface/IImageFile";
import moment from "moment";
import Subject from "../subject/subject.model";

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
        } else {
            return {
                refreshToken: null,
                accessToken: null,
            };
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

const getMeFromDB = async (authUser: IJwtPayload) => {
    const { userId } = authUser;
    const user = await User.findById(userId);

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, "User not found!");
    }

    if (user?.role === "tutor") {
        const tutor = await Tutor.findOne({ user: user?._id });

        if (!tutor) {
            throw new AppError(StatusCodes.NOT_FOUND, "Tutor not found!");
        }

        return tutor;
    } else if (user?.role === "student") {
        const student = await Student.findOne({ user: user?._id }).populate(
            "subjectsOfInterest bookingHistory reviewsGiven"
        );

        if (!student) {
            throw new AppError(StatusCodes.NOT_FOUND, "Student not found!");
        }

        return student;
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

    const {
        reviewsGiven,
        bookingHistory,
        subjectsOfInterest,
        ...filteredPayload
    } = payload;

    const updatedData: any = {
        ...filteredPayload,
    };

    if (subjectsOfInterest && Array.isArray(subjectsOfInterest)) {
        const validSubjects = await Subject.find({
            _id: { $in: subjectsOfInterest },
        });

        if (validSubjects.length !== subjectsOfInterest.length) {
            throw new AppError(
                StatusCodes.BAD_REQUEST,
                "Some subjects are invalid or do not exist!"
            );
        }

        updatedData.$addToSet = {
            subjectsOfInterest: { $each: validSubjects.map((s) => s._id) },
        };
    }

    const result = await Student.findOneAndUpdate(
        { user: authUser?.userId },
        updatedData,
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
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

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

        const {
            user,
            earnings,
            subjects,
            reviews,
            availability,
            ...filteredPayload
        } = payload;

        const updatedData: any = { ...filteredPayload };

        if (availability && Array.isArray(availability)) {
            const tutor = await Tutor.findOne({
                user: authUser?.userId,
            }).session(session);

            if (!tutor) {
                throw new AppError(StatusCodes.NOT_FOUND, "Tutor not found!");
            }

            const newAvailability = [];
            for (const newSlot of availability) {
                const { day, startTime, endTime } = newSlot;

                if (!day || !startTime || !endTime) {
                    throw new AppError(
                        StatusCodes.BAD_REQUEST,
                        "Each availability slot must include day, startTime, and endTime!"
                    );
                }

                const normalizedDay =
                    DaysOfWeek[day as keyof typeof DaysOfWeek];
                if (!normalizedDay) {
                    throw new AppError(
                        StatusCodes.BAD_REQUEST,
                        `Invalid day: ${day}. Allowed days: ${Object.keys(
                            DaysOfWeek
                        ).join(", ")}.`
                    );
                }

                const start = moment(startTime, "HH:mm");
                const end = moment(endTime, "HH:mm");

                if (!start.isValid() || !end.isValid()) {
                    throw new AppError(
                        StatusCodes.BAD_REQUEST,
                        "Invalid time format. Use 24-hour format (HH:mm)."
                    );
                }

                if (end.isSameOrBefore(start)) {
                    throw new AppError(
                        StatusCodes.BAD_REQUEST,
                        "End time must be later than start time!"
                    );
                }

                const durationInHours = end
                    .diff(start, "hours", true)
                    .toFixed(2);

                newAvailability.push({
                    day: normalizedDay,
                    startTime,
                    endTime,
                    totalHours: durationInHours,
                });
            }

            newAvailability.sort((a, b) => {
                const dayComparison =
                    (DaysOfWeek[
                        a.day as keyof typeof DaysOfWeek
                    ] as unknown as number) -
                    (DaysOfWeek[
                        b.day as keyof typeof DaysOfWeek
                    ] as unknown as number);

                if (dayComparison !== 0) return dayComparison;

                return moment(a.startTime, "HH:mm").diff(
                    moment(b.startTime, "HH:mm")
                );
            });

            for (let i = 0; i < newAvailability.length - 1; i++) {
                const currentSlot = newAvailability[i];
                const nextSlot = newAvailability[i + 1];

                if (
                    currentSlot.day === nextSlot.day &&
                    moment(currentSlot.endTime, "HH:mm").isAfter(
                        moment(nextSlot.startTime, "HH:mm")
                    )
                ) {
                    throw new AppError(
                        StatusCodes.BAD_REQUEST,
                        `Overlapping time slots detected on ${currentSlot.day}: (${currentSlot.startTime} - ${currentSlot.endTime}) and (${nextSlot.startTime} - ${nextSlot.endTime}).`
                    );
                }
            }

            updatedData.availability = newAvailability;
        }

        const result = await Tutor.findOneAndUpdate(
            { user: authUser?.userId },
            updatedData,
            { new: true, session }
        );

        await session.commitTransaction();
        return result;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

export const UserServices = {
    registerUserIntoDB,
    getMeFromDB,
    updateStudentProfileIntoDB,
    updateTutorProfileIntoDB,
};
