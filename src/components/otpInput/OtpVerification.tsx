import { REGEXP_ONLY_DIGITS } from "input-otp";
import React, { useState } from "react";
import Countdown, { CountdownRenderProps } from "react-countdown";

import { Button } from "../ui/button";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../ui/input-otp";
import { Label } from "../ui/label";

export type OtpVerificationProps = {
  user: {
    email: string;
  };
  resendOtp: () => void;
  timer: string | number;
  onOtpChange: (value: string) => void;
};
export const OtpVerification: React.FC<OtpVerificationProps> = ({ user, resendOtp, timer, onOtpChange }) => {
  const [isOtpExpired, setIsOtpExpired] = useState(false);
  const [duration, setDuration] = useState(Date.now() + +timer);

  const renderer = ({ seconds, completed }: CountdownRenderProps) => {
    // console.log(duration,timer);
    if (completed) {
      // Render a completed state
      setIsOtpExpired(true);
      return <> </>;
    } else {
      // Render a countdown
      return <p>Timer {seconds} Sec</p>;
    }
  };
  const onresend = () => {
    resendOtp();
    setDuration(Date.now() + +timer);
    setIsOtpExpired(false);
  };
  return (
    <div>
      <div className="flex justify-between">
        <Label> Email verification code</Label>
        <p className="font-normal text-xs ">
          {!isOtpExpired ? (
            <Countdown date={duration} renderer={renderer} intervalDelay={0} precision={3} />
          ) : (
            <Button variant={"link"} onClick={() => onresend()}>
              Resend OTP
            </Button>
          )}
        </p>
      </div>

      <div className="w-full flex justify-center">
        <InputOTP maxLength={6} onChange={(value: string) => onOtpChange(value)} pattern={REGEXP_ONLY_DIGITS} autoFocus>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={1} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={4} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <p className="mt-2 text-xs">Enter the 6 digit code sent to {user?.email}</p>
    </div>
  );
};
