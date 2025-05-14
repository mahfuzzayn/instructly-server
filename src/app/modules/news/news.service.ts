import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/appError";
import { News } from "./news.model";

const getAllNewsFromDB = async () => {
    const news = await News.find();

    if (!news) {
        throw new AppError(StatusCodes.NOT_FOUND, "No news were found!");
    }

    return {
        articles: news,
        totalResults: news.length || 0,
    };
};

export const NewsServices = {
    getAllNewsFromDB,
};
