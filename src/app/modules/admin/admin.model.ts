import { Schema, model } from "mongoose";
import { IAdmin } from "./admin.interface";

const adminSchema = new Schema<IAdmin>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        bio: { type: String, default: null },
        profileUrl: {
            type: String,
            default: null,
            validate: {
                validator: function (v: string) {
                    if (!v) return true;
                    return /^(http(s)?:\/\/.*\.(?:png|jpg|jpeg))/.test(v);
                },
                message: "Invalid photo URL format.",
            },
        },
    },
    { timestamps: true }
);

const Admin = model<IAdmin>("Admin", adminSchema);

export default Admin;
