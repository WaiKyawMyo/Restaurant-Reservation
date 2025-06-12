import { z } from "zod"


 const ChangepasswordSchema = z.object({
    password: z.string(),
    comfirmPassword: z.string()
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
  
})

export default ChangepasswordSchema