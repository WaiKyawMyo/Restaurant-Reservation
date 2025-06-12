import otpGenerator from 'otp-generator';

export function generateOTP(): string {
  const otp: string = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
    digits: true, // Ensure it's numeric
  });
  return otp;
}