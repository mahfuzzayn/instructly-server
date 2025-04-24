import { IStatus } from "./booking.interface";

export const statusTransitions: Record<IStatus, IStatus[]> = {
    [IStatus.PENDING_APPROVAL]: [
        IStatus.WAITING_FOR_PAYMENT,
        IStatus.CANCELED_BY_TUTOR,
    ],
    [IStatus.WAITING_FOR_PAYMENT]: [
        IStatus.CONFIRMED,
        IStatus.CANCELED_BY_STUDENT,
    ],
    [IStatus.CONFIRMED]: [IStatus.COMPLETED, IStatus.CANCELED_BY_TUTOR],
    [IStatus.CANCELED_BY_TUTOR]: [],
    [IStatus.CANCELED_BY_STUDENT]: [],
    [IStatus.COMPLETED]: [],
};
