import { AppError } from "../../utils/appError.js";
import { createUser, getAllUser, findEmail } from "./user.repository.js";
import type { UserDto } from "./user.dto.js";
export const createUserService = async (data: UserDto) => {
  const existingUser = await findEmail(data.email);
  if (existingUser) {
    throw new AppError("Email is existing", 400);
  }

  return createUser(data.email, data.name);
};

export const getAllUserService = () => {
  const user = getAllUser();
  if (!user) {
    throw new AppError("User does not exist!", 404);
  }
  return user;
};
