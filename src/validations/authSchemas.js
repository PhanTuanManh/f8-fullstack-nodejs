import * as z from "zod";

const register = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(6),
  role: z.string().optional(),
});

const login = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const authSchema = { register, login };

export default authSchema;
