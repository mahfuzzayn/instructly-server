import { IAdmin } from "./admin.interface";
import Admin from "./admin.model";

const registerAdminIntoDB = async (payload: IAdmin) => {
    const result = await Admin.create(payload);

    return result;
};

export const AdminServices = {
    registerAdminIntoDB,
};
