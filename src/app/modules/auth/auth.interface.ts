import { Types } from "mongoose";
import { UserRole } from "../user/user.interface";

export interface IAuth {
    email: string;
    password: string;
}

export interface IJwtPayload {
    userId: Types.ObjectId;
    name: string;
    email: string;
    role: UserRole;
    isActive: boolean;
}
