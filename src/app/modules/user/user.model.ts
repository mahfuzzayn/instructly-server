import mongoose, { Schema } from "mongoose";
import { IUser, UserModel, UserRole } from "./user.interface";
import bcrypt from "bcrypt";
import config from "../../config";
import AppError from "../../errors/appError";
import { StatusCodes } from "http-status-codes";

const userSchema = new Schema<IUser, UserModel>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            sparse: true,
        },
        password: {
            type: String,
            select: false,
            required: true,
        },
        role: {
            type: String,
            enum: [UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN],
            default: UserRole.STUDENT,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    const user = this;

    user.password = await bcrypt.hash(
        user.password,
        Number(config.bcrypt_salt_rounds)
    );

    next();
});

userSchema.post("save", function (doc, next) {
    doc.password = "";
    next();
});

userSchema.statics.isPasswordMatched = async function (
    plainTextPassword,
    hashedPassword
) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isUserExistsByEmail = async function (email: string) {
    return await User.findOne({ email }).select("+password");
};

userSchema.statics.isUserExistsById = async function (userId: string) {
    const existingUser = await this.findById(userId);

    if (!existingUser) {
        throw new AppError(StatusCodes.NOT_ACCEPTABLE, "User does not exist!");
    }

    if (!existingUser.isActive) {
        throw new AppError(StatusCodes.NOT_ACCEPTABLE, "User is not active!");
    }

    return existingUser;
};

const User = mongoose.model<IUser, UserModel>("User", userSchema);
export default User;
