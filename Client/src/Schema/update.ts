import { z } from "zod"


 const updateSchema = z.object({
    username: z.string().optional(),
    email :z.string().email("Invalid email address").optional().or(z.literal('')),
   phone_no:z.string().min(8, "Phone number must be at least 10 characters").optional().or(z.literal('')),
})

export default updateSchema