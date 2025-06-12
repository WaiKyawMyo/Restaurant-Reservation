export interface RequestOtpBody {
  email: string;
}

export interface VerifyOtpBody {
  email: string;
  userOtp: string;
}

export interface ApiResponse {
  message: string;
  error?: string; // Optional error details
}

// You might also move OtpData here if it's widely used
export interface OtpData {
  otp: string;
  expiresAt: number;
}