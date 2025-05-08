import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { SubjectRoutes } from "../modules/subject/subject.routes";
import { BookingRoutes } from "../modules/booking/booking.routes";
import { SSLRoutes } from "../modules/sslcommerz/sslcommerz.routes";
import { ReviewRoutes } from "../modules/review/review.routes";
import { TutorRoutes } from "../modules/tutor/tutor.routes";
const router = Router();

const moduleRoutes = [
    {
        path: "/users",
        route: UserRoutes,
    },
    {
        path: "/tutors",
        route: TutorRoutes,
    },
    {
        path: "/auth",
        route: AuthRoutes,
    },
    {
        path: "/subjects",
        route: SubjectRoutes,
    },
    {
        path: "/bookings",
        route: BookingRoutes,
    },
    {
        path: "/reviews",
        route: ReviewRoutes,
    },
    {
        path: "/ssl",
        route: SSLRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
