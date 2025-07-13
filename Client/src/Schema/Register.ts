import { z } from "zod"


 const RegisterSchema = z.object({
    username: z.string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must be at most 20 characters" })
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
    email : z.string().email("Invalid email address"),
    phone_no:z.string().min(8, "Phone number must be at least 10 characters"),
    password: z.string()
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
})

export default RegisterSchema