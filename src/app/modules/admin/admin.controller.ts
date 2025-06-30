import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AdminServices } from "./admin.service";

const registerAdmin = catchAsync(async (req, res) => {
    const result = await AdminServices.registerAdminIntoDB(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Admin registration completed successfully!",
        data: result,
    });
});

const getAllAdmins = catchAsync(async (req, res) => {
    const result = await AdminServices.getAllAdminsFromDB(req.query);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Admins retrieved successfully!",
        meta: result.meta,
        data: result.result,
    });
});

const getSingleAdmin = catchAsync(async (req, res) => {
    const { studentId: adminId } = req.params;
    const result = await AdminServices.getSingleAdminFromDB(adminId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Admin retrieved successfully!",
        data: result,
    });
});

export const AdminController = {
    registerAdmin,
    getAllAdmins,
    getSingleAdmin,
};
