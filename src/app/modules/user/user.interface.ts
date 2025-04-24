import { Model, Types } from "mongoose";

export enum UserRole {
    STUDENT = "student",
    TUTOR = "tutor",
}

export interface IUser {
    _id: Types.ObjectId;
    email: string;
    name: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserModel extends Model<IUser> {
    isPasswordMatched(
        plainTextPassword: string,
        hashedPassword: string
    ): Promise<boolean>;
    isUserExistsByEmail(id: string): Promise<IUser>;
    isUserExistsById(userId: string): Promise<IUser>;
}
