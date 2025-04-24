import { statusTransitions } from "./booking.constant";
import { IStatus } from "./booking.interface";

export function canChangeBookingStatus(
    currentStatus: IStatus,
    newStatus: IStatus
): boolean {
    return statusTransitions[currentStatus].includes(newStatus);
}
