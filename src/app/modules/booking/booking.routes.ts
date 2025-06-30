import { Router } from "express";
import auth from "../../middleware/auth";
import { UserRole } from "../user/user.interface";
import { BookingController } from "./booking.controller";

const router = Router();

router.post(
    "/create-booking",
    auth(UserRole.STUDENT),
    BookingController.createBooking
);

router.get(
    "/:bookingId",
    auth(UserRole.STUDENT, UserRole.TUTOR),
    BookingController.getSingleBooking
);

router.get(
    "/trx/:trxId",
    auth(UserRole.STUDENT, UserRole.TUTOR),
    BookingController.getSingleBookingByTrxId
);

// Admin will retrieve all bookings. Tutor & Studnet will only retrieve their bookings.
router.get(
    "/",
    auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
    BookingController.getMyBookings
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
