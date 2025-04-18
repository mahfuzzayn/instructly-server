import { UserRole } from "../user/user.interface";

export interface IAuth {
    email: string;
    password: string;
    clientInfo: {
        device: "pc" | "mobile";
        browser: string;
        ipAddress: string;
        pcName?: string;
        os?: string;
        userAgent?: string;
    };
}

export interface IJwtPayload {
    userId: string;
    name: string;
    email: string;
    isTutor: boolean;
    role: UserRole;
    isActive: boolean;
}
