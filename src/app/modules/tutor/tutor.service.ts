import { ITutor } from "./tutor.interface";
import Tutor from "./tutor.model";

const registerTutorIntoDB = async (payload: ITutor) => {
    const result = await Tutor.create(payload);

    return result;
};

export const TutorServices = {
    registerTutorIntoDB,
};
