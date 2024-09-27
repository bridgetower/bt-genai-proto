import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";

import { useAuth } from "../../providers/CoginitoAuthProvider";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

type ResetPasswordProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ResetPassword: React.FC<ResetPasswordProps> = ({ isOpen, onClose }) => {
  const { resetPassword, error } = useAuth();

  // Define validation schema using Yup
  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    verificationCode: Yup.string().required("Verification code is required"),
    newPassword: Yup.string().min(8, "Password must be at least 8 characters").required("New password is required")
  });

  // Formik initialization
  const formik = useFormik({
    initialValues: {
      username: "",
      verificationCode: "",
      newPassword: ""
    },
    validationSchema,
    onSubmit: (values) => {
      resetPassword(values.username, values.verificationCode, values.newPassword);
    }
  });

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => onClose()}>
        <DialogContent className="bg-white max-w-sm">
          <DialogHeader className="text-h3 font-bold">Reset password</DialogHeader>
          <Separator />

          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            <div>
              <Label>Username</Label>
              <Input type="text" name="username" value={formik.values.username} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              {formik.touched.username && formik.errors.username ? <p className="text-red-500">{formik.errors.username}</p> : null}
            </div>

            <div>
              <Label>Verification Code</Label>
              <Input
                type="text"
                name="verificationCode"
                value={formik.values.verificationCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.verificationCode && formik.errors.verificationCode ? (
                <p className="text-red-500">{formik.errors.verificationCode}</p>
              ) : null}
            </div>

            <div>
              <Label>New Password</Label>
              <Input
                type="password"
                name="newPassword"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.newPassword && formik.errors.newPassword ? <p className="text-red-500">{formik.errors.newPassword}</p> : null}
            </div>

            {error && error?.message && <p className="text-red-500 mt-4">{error?.message}</p>}

            <DialogFooter className="flex w-full">
              <Button variant="outline" onClick={() => onClose()}>
                Cancel
              </Button>
              <Button className="ml-1" type="submit">
                Reset Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ResetPassword;
