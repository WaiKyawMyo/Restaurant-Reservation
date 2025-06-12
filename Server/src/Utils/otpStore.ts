export interface OtpData {
  otp: string;
  expiresAt: number;
}

// Using Record<string, OtpData> for a key-value store where key is email (string)
const otpStore: Record<string, OtpData> = {};

const OTP_EXPIRY_MS: number = 5 * 60 * 1000; // 5 minutes

export function storeOTP(email: string, otp: string): void {
  const expiresAt = Date.now() + OTP_EXPIRY_MS;
  otpStore[email] = { otp, expiresAt };
  console.log(`OTP for ${email}: ${otp} (Expires at: ${new Date(expiresAt)})`);
}

export function getStoredOTP(email: string): OtpData | undefined {
  return otpStore[email];
}

export function clearOTP(email: string): void {
  delete otpStore[email];
}