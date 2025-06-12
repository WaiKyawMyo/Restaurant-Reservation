import { z } from "zod"


 const updateSchema = z.object({
    username: z.string().optional(),
    email :z.string().email("Invalid email address").optional(),
   
})

export default updateSchema