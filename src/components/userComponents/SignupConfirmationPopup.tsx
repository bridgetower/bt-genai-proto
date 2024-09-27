// src/components/ConfirmSignup.tsx
import React, { useState } from "react";

import { useAuth } from "../../providers/CoginitoAuthProvider";
import { Loader } from "../loader/Loader";
import { OtpVerification } from "../otpInput/OtpVerification";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogOverlay } from "../ui/dialog";
import { Separator } from "../ui/separator";

interface ConfirmSignupProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

const SignupConfirmSignup: React.FC<ConfirmSignupProps> = ({ isOpen, onClose, username }) => {
  const [confirmationCode, setConfirmationCode] = useState("");
  // const [loading, setLoading] = useState<boolean>(false);
  // const navigate = useNavigate()
  const { resendConfirmationCode, verifyConfirmationCode, isLoading } = useAuth();

  const onConfirm = () => {
    verifyConfirmationCode(username, confirmationCode, onClose);
    // setLoading(true);
    // const userData = {
    //   Username: username,
    //   Pool: congitoUserPool
    // };

    // const cognitoUser = new CognitoUser(userData);

    // cognitoUser.confirmRegistration(confirmationCode, true, (err: Error | undefined) => {
    //   if (err) {
    //     setLoading(false);
    //     toast.error(err.message || "Failed to confirm signup");
    //   } else {
    //     setLoading(false);
    //     toast.success("Signup confirmed successfully");
    //     onClose();
    //     navigate("/");
    //   }
    // });
  };
  const onInputChange = (value: string) => {
    setConfirmationCode(value);
  };
  const resendCode = () => {
    resendConfirmationCode(username);
  };

  return (
    <>
      <Loader show={isLoading} />
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>Confirm Signup</DialogHeader>
          <DialogClose />
          <Separator />
          <div className="py-5">
            <OtpVerification onOtpChange={onInputChange} resendOtp={resendCode} timer={60000} user={{ email: username }} />
          </div>
          <DialogFooter className="flex w-full">
            <Button onClick={onConfirm}>Confirm</Button>
            <Button className="ml-1" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SignupConfirmSignup;
