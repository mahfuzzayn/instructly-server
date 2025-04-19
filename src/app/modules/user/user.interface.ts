import { Model, Types } from "mongoose";
import { ITutor } from "../tutor/tutor.interface";

export enum UserRole {
    STUDENT = "student",
    TUTOR = "tutor",
}

export interface IUser extends Partial<ITutor> {
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
