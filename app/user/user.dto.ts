import { Role } from "@prisma/client";
import { BaseSchema } from "../common/dto/base.dto";

export interface UserDTO extends BaseSchema {
  email: string;
  fullName: string;
  role: Role;    // Using the Role enum from Prisma
}