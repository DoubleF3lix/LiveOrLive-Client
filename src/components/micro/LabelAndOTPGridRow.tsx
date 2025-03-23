import { useState } from "react";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
  } from "@/input-otp"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";


type LabelAndOTPGridRowArgs = {
    label: string;
    OTPRef: React.MutableRefObject<string>;
    length?: number;
};

export default function LabelAndTextInputGridRow({ label, OTPRef, length = 4 }: LabelAndOTPGridRowArgs) {
    const [OTP, setOTP] = useState<string>(""); 

    return [
        <label key={`${label}-label`} htmlFor={label} className="content-center mr-2">{label}</label>,
        <InputOTP key={`${label}-input`} maxLength={length} autoFocus pattern={REGEXP_ONLY_DIGITS_AND_CHARS} value={OTP} onChange={OTP => { 
            setOTP(OTP); 
            OTPRef.current = OTP.length === length ? OTP : ""; 
        }}>
            <InputOTPGroup>
                {[...Array(length)].map((_, index) => <InputOTPSlot key={index} index={index} />)} 
            </InputOTPGroup>
        </InputOTP>
    ];
}