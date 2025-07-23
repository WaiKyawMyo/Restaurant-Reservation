import { z } from "zod"

const PaymentSchema = z.object({
    cardName: z.string()
        .min(2, "Card name must be at least 2 characters long"),
    
    cardNumber: z.string()
        .min(13, "Card number must be at least 13 digits")
        .max(19, "Card number must not exceed 19 digits"),
    
    expirationDate: z.string()
        .regex(/^(0[1-9]|1[0-2])\/(\d{2}|\d{4})$/, "Invalid expiration date format (MM/YY)"),
    
    cvv: z.string()
        .regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits")
})

export default PaymentSchema