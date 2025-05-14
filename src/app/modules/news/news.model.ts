import { model, Schema } from "mongoose";
import { IArticle } from "./news.interface";

const newsSchema = new Schema<IArticle>(
    {
        source: {
            id: {
                type: String || null,
                default: null,
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
        },
        author: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        urlToImage: {
            type: String,
            required: true,
        },
        publishedAt: {
            type: Date,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const News = model<IArticle>("News", newsSchema);
