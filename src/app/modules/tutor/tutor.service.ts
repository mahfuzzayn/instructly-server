import { StatusCodes } from "http-status-codes";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/appError";
import { ITutor, TutorQuery } from "./tutor.interface";
import Tutor from "./tutor.model";
import { tutorSearchableFields } from "./tutor.const";

const registerTutorIntoDB = async (payload: ITutor) => {
    const result = await Tutor.create(payload);

    return result;
};

const getAllTutorsFromDB = async (query: Record<string, unknown>) => {
    const { subjects, rating, minHRate, maxHRate, availability, location } =
        query;

    const filter: Record<string, any> = {};

    if (subjects) {
        const subjectArray =
            typeof subjects === "string" ? subjects?.split(",") : subjects;

        filter.subjects = {
            $in: Array.isArray(subjectArray) ? subjectArray : [subjectArray],
        };
    }

    if (rating) {
        filter.averageRating = { $gte: Number(rating) };
    }

    if (location) {
        const locationFilter: any = { $regex: location, $options: "i" };

        filter.location = locationFilter;
    }

    if (availability) {
        let days: string[];

        if (typeof availability === "string") {
            days = availability.split(",");
        } else if (Array.isArray(availability)) {
            days = availability;
        } else {
            throw new Error(
                "Invalid availability format. Must be a string or array."
            );
        }

        filter.availability = {
            $elemMatch: {
                day: { $in: days.map((day: string) => new RegExp(day, "i")) },
            },
        };
    }

    const tutorsQuery = new QueryBuilder(
        Tutor.find(filter).populate("user reviews subjects"),
        query as any
    )
        .search(tutorSearchableFields)
        .sort()
        .paginate()
        .fields()
        .priceRange(Number(minHRate) || 0, Number(maxHRate!) || Infinity);

    const tutors = await tutorsQuery.modelQuery.lean();

    const meta = await tutorsQuery.countTotal();

    if (!tutors) {
        throw new AppError(StatusCodes.NOT_FOUND, "No tutors were found!");
    }

    return {
        meta,
        result: tutors,
    };
};

const getSingleTutorFromDB = async (tutorId: string) => {
    const tutor = await Tutor.findById(tutorId)
        .populate("user")
        .populate({
            path: "reviews",
            populate: [
                {
                    path: "student",
                    populate: [{ path: "user", select: "name email" }],
                },
                {
                    path: "tutor",
                    populate: [{ path: "user", select: "name email" }],
                },
            ],
        })
        .populate("subjects");

    if (!tutor) {
        throw new AppError(StatusCodes.NOT_FOUND, "No tutor were found!");
    }

    return tutor;
};

export const TutorServices = {
    registerTutorIntoDB,
    getAllTutorsFromDB,
    getSingleTutorFromDB,
};
