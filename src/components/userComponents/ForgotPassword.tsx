// src/components/ForgotPassword.tsx
import { useFormik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";

import { useAuth } from "../../providers/CoginitoAuthProvider";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import ResetPassword from "./ResetPassword";

// Validation schema
const validationSchema = Yup.object({
  username: Yup.string().email("Invalid email address").required("Username is required")
});

const ForgotPassword: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showResetPassword, setShowResetPassword] = useState<boolean>(false);
  const { forgotPassword } = useAuth();

  // Formik setup
  const formik = useFormik({
    initialValues: {
      username: ""
    },
    validationSchema,
    onSubmit: (values) => {
      forgotPassword(values.username);
    }
  });

  const onCloseResetPassword = () => {
    setShowResetPassword(false);
  };

  return (
    <>
      <ResetPassword isOpen={showResetPassword} onClose={onCloseResetPassword} />
      <Button
        variant="link"
        size="sm"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Forgot password?
      </Button>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent className="bg-white max-w-sm">
          <DialogHeader className="text-h3 font-bold">Forgot password</DialogHeader>
          <Separator />
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                className="my-2"
                type="text"
                {...formik.getFieldProps("username")}
                placeholder="Enter registered email-id"
              />
              {formik.touched.username && formik.errors.username ? (
                <div className="text-red-600 text-sm">{formik.errors.username}</div>
              ) : null}
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Send Reset Code</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ForgotPassword;
