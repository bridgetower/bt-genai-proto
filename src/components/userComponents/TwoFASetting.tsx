import { REGEXP_ONLY_DIGITS } from "input-otp";
import React, { useState } from "react";
import QRCode from "react-qr-code";

import { useAuth } from "../../providers/CoginitoAuthProvider";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogOverlay } from "../ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../ui/input-otp";
import { Separator } from "../ui/separator";

type TwoFaSettingProps = {
  open: boolean;
  onClose: () => void;
  is2FaEnabled: boolean;
};

export const TwoFaSetting: React.FC<TwoFaSettingProps> = ({ open, onClose, is2FaEnabled }) => {
  // const [qrCode, setQrCode] = useState(null);
  // const userId = getThisUser()?.id;
  // const [is2FaEnabled, setIs2FaEnabled] = useState(false);
  const [twoFaCode, setTwoFaCode] = useState("");
  const { verifyAssociateSoftwareToken, mfaAuthUrl } = useAuth();
  const onsubmit = () => {
    verifyAssociateSoftwareToken(twoFaCode);
  };
  return (
    <>
      {/* <Toaster /> */}
      <Dialog open={open} onOpenChange={() => onClose()}>
        <DialogOverlay />
        <DialogContent className="bg-card">
          <DialogHeader>Two-Factor Authentication (2FA)</DialogHeader>
          <DialogClose />
          <Separator />
          <div className="py-5">
            {!is2FaEnabled && (
              <div>
                <p className="font-normal text-sm">
                  Open your authenticator app (like Google Authenticator or Authy), and select the option to scan a QR code. Point your
                  camera at below QR. After scanning, the app will display a 6-digit code. Enter that code below to finish the setup.
                </p>
                <div className="mt-6">
                  <div className="flex justify-center">
                    <QRCode size={220} value={mfaAuthUrl} />
                  </div>
                </div>
              </div>
            )}
            <div className="mt-5">
              <div className="flex justify-center">
                <InputOTP maxLength={6} onChange={(value: string) => setTwoFaCode(value)} pattern={REGEXP_ONLY_DIGITS} autoFocus>
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
            </div>
          </div>
          <Separator />
          <DialogFooter>
            <Button
              onClick={() => {
                onsubmit();
              }}
              disabled={twoFaCode.length < 6}
              variant="default"
            >
              {is2FaEnabled ? "Disable" : "Enable"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
