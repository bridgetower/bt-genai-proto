// src/components/ConfirmSignup.tsx
import { REGEXP_ONLY_DIGITS } from "input-otp";
import React from "react";

import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "../ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../ui/input-otp";
import { Separator } from "../ui/separator";

interface MFAInputProps {
  isOpen: boolean;
  onClose: () => void;
  onOtpChange: (code: string) => void;
  onSubmit: () => void;
}

const MFAInput: React.FC<MFAInputProps> = ({ isOpen, onClose, onOtpChange, onSubmit }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader className="text-h3 font-bold">MFA Code</DialogHeader>
        <Separator />
        <div className="flex justify-center py-4">
          <InputOTP
            pattern={REGEXP_ONLY_DIGITS}
            onChange={(value: string) => {
              onOtpChange(value);
            }}
            maxLength={6}
            autoFocus
          >
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

        <DialogFooter className="gap-y-2 text-center">
          <Button onClick={onSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MFAInput;
