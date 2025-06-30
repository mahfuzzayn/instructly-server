import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/appError";
import { IAdmin } from "./admin.interface";
import Admin from "./admin.model";
import QueryBuilder from "../../builder/QueryBuilder";

const registerAdminIntoDB = async (payload: IAdmin) => {
    const result = await Admin.create(payload);

    return result;
};

const getAllAdminsFromDB = async (query: Record<string, unknown>) => {
    const filter: Record<string, any> = {};

    const adminsQuery = new QueryBuilder(
        Admin.find(filter).populate("user"),
        query as any
    )
        .sort()
        .paginate()
        .fields();

    const tutors = await adminsQuery.modelQuery.lean();

    const meta = await adminsQuery.countTotal();

    if (!tutors) {
        throw new AppError(StatusCodes.NOT_FOUND, "No admins were found!");
    }

    return {
        meta,
        result: tutors,
    };
};

const getSingleAdminFromDB = async (adminId: string) => {
    const student = await Admin.findById(adminId).populate("user");

    if (!student) {
        throw new AppError(StatusCodes.NOT_FOUND, "No admin were found!");
    }

    return student;
};

export const AdminServices = {
    registerAdminIntoDB,
    getAllAdminsFromDB,
    getSingleAdminFromDB,
};
