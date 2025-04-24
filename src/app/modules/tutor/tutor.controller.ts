import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { TutorServices } from "./tutor.service";

const registerTutor = catchAsync(async (req, res) => {
    const result = await TutorServices.registerTutorIntoDB(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Tutor registration completed successfully!",
        data: result,
    });
});

export const TutorController = {
    registerTutor,
};
