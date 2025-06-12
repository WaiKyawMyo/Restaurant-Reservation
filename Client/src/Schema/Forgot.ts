import { z } from "zod"


 const ForgotSchema = z.object({
    email : z.string().email("Invalid email address"),
  
  
})

export default ForgotSchema