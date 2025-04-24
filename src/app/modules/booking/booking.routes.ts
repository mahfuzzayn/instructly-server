import { Router } from "express";
import auth from "../../middleware/auth";
import { UserRole } from "../user/user.interface";
import { BookingController } from "./booking.controller";

const router = Router();

router.post(
    "/create-booking",
    auth(UserRole.STUDENT, UserRole.TUTOR),
    BookingController.createBooking
);

router.patch(
    "/change-status/:bookingId",
    auth(UserRole.STUDENT, UserRole.TUTOR),
    BookingController.changeBookingStatus
);

router.post(
    "/:bookingId/pay",
    auth(UserRole.STUDENT),
    BookingController.initiatePayment
);

export const BookingRoutes = router;
