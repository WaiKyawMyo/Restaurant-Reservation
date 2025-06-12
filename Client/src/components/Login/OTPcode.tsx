
import React, { useRef, useState, type ChangeEvent, type ClipboardEvent, type FocusEvent, type FormEvent, type KeyboardEvent, } from "react";
import { useVarifyOTPMutation } from "../../Slice/API/userApi";
import { Link, useLocation, useNavigate } from "react-router";
import { Bounce, toast, ToastContainer } from "react-toastify";
import background from '../../assets/Background.jpg'

const OTP_LENGTH = 6;

const OtpVerification: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const navigate = useNavigate()
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const [VarifyOtp,{isLoading}] = useVarifyOTPMutation()
  // Handle KEY DOWN (for backspace/delete and digit validation)
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (
      !/^[0-9]$/.test(e.key) &&
      e.key !== "Backspace" && e.key !== "Delete" && 
      e.key !== "Tab" && !e.metaKey
    ) {
      e.preventDefault();
    }
    // Handle backspace/delete: clear and focus previous
    if ((e.key === "Backspace" || e.key === "Delete") && idx > 0) {
      setOtp((prev) => [
        ...prev.slice(0, idx - 1),
        "",
        ...prev.slice(idx)
      ]);
      inputRefs.current[idx - 1]?.focus();
    }
  };

  // Handle single input change
  const handleInput = (e: ChangeEvent<HTMLInputElement>, idx: number) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value)) {
      setOtp((prev) => [
        ...prev.slice(0, idx),
        value,
        ...prev.slice(idx + 1)
      ]);
      if (idx < OTP_LENGTH - 1) {
        inputRefs.current[idx + 1]?.focus();
      }
    } else if (value === "") {
      setOtp((prev) => [
        ...prev.slice(0, idx),
        "",
        ...prev.slice(idx + 1)
      ]);
    }
  };

  // Handle focus: select current digit
  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  // Handle paste: fill all boxes
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    if (!/^\d{4}$/.test(text)) return;
    setOtp(text.split(""));
    inputRefs.current[OTP_LENGTH - 1]?.focus();
  };
const location = useLocation();
const email = location.state?.email;
console.log(email)
  // On form submit
  const handleSubmit = async(e: FormEvent) => {
   try {
     e.preventDefault();
    const otpValue = otp.join(""); // or as number: Number(otp.join(""))
    const data = {
        email  , 
        userOtp : otpValue
    }
    const res:any = await VarifyOtp(data)
   
    if(res.error){
        toast.error(res.error.data.message)
       
    }else{
         toast.success("Verification successful!",{
         onClose: () => {
              navigate('/changepassword',{ state: { email } });
            }
       })
    }
    
   
   } catch (err:any) {
    toast.error(err?.data?.message || err?.error)
   }
    
  };

  return (
    <section className="bg-cover bg-center bg-amber-600 h-screen opacity-0.9 " style={{backgroundImage:`url(${background})`}}>
       <div className="flex flex-col items-center justify-center px-2 py-4 mx-auto md:h-screen lg:py-4">
    <div className="max-w-md mx-auto text-center bg-white border   px-4 sm:px-8 py-10 rounded-xl shadow mt-9">
         <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
        />
      <header className="mb-8 ">
        <h1 className="text-2xl font-bold mb-1">Mobile Phone Verification</h1>
        <p className="text-[15px] text-slate-500">
          Enter the 6-digit verification code that was sent to your email.
        </p>
      </header>
      <form id="otp-form" onSubmit={handleSubmit}>
        <div className="flex  items-center justify-center gap-3">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={1}
              ref={el => { inputRefs.current[idx] = el; }}
              value={digit}
              onChange={e => handleInput(e, idx)}
              onKeyDown={e => handleKeyDown(e, idx)}
              onFocus={handleFocus}
              onPaste={handlePaste}
              className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-gray-300 hover:border-slate-200 appearance-none rounded p-4 outline-none  focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          ))}
        </div>
        <div className="max-w-[260px] mx-auto mt-4">
          <button
            type="submit"
            className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150"
            disabled={otp.some(digit => digit === "") || isLoading}
          >
            Verify Account
          </button>
        </div>
      </form>
      <div className="text-sm text-slate-500 mt-4">
        Didn't receive code?{" "}
        <Link to={'/Forgot'}
          className="font-medium text-indigo-500 hover:text-indigo-600"
         
        >
          Resend
        </Link>
      </div>
    </div>
    </div>
    </section>
  );
};

export default OtpVerification;