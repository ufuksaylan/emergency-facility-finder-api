import { commonValidations } from "@/common/utils/commonValidation";
// src/api/user/userModel.ts
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

// This will be used for validation
// The actual entity comes from database/entity/User.ts
export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  age: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserDTO = z.infer<typeof UserSchema>;

// Input validation schemas
export const GetUserSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const CreateUserSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    age: z.number().int().positive(),
  }),
});

export const UpdateUserSchema = z.object({
  params: z.object({ id: commonValidations.id }),
  body: z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    age: z.number().int().positive().optional(),
  }),
});
