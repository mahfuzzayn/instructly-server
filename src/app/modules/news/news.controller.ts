import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { NewsServices } from "./news.service";

const getAllNews = catchAsync(async (req, res) => {
    const result = await NewsServices.getAllNewsFromDB();

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "News retrieved successfully!",
        data: result,
    });
});

export const NewsController = {
    getAllNews,
};
