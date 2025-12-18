import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email("Email invalid"),
    name: z.string().min(2, "The name is too short!"),
  }),
  query: z.string().optional(),
  params: z.string().optional(),
});
