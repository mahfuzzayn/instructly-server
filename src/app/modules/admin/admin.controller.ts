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

export const AdminController = {
    registerAdmin,
};
