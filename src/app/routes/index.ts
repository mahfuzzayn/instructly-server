import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { SubjectRoutes } from "../modules/subject/subject.routes";
const router = Router();

const moduleRoutes = [
    {
        path: "/users",
        route: UserRoutes,
    },
    {
        path: "/auth",
        route: AuthRoutes,
    },
    {
        path: "/subjects",
        route: SubjectRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
