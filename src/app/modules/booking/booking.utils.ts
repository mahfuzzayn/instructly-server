import { statusTransitions } from "./booking.constant";
import { IStatus } from "./booking.interface";

export function canChangeBookingStatus(
    currentStatus: IStatus,
    newStatus: IStatus
): boolean {
    return statusTransitions[currentStatus].includes(newStatus);
}

export const generateTransactionId = (prefix: string = "IT"): string => {
    const timestamp = new Date()
        .toISOString()
        .replace(/[-T:.Z]/g, "")
        .slice(0, 14);
    const randomString = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
    return `${prefix}_${timestamp}_${randomString}`;
};
