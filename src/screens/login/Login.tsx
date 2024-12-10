import { Field, Formik } from "formik";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Loader } from "../../components/loader/Loader";
import MFAInput from "../../components/otpInput/MfaInput";
import ForgotPassword from "../../components/userComponents/ForgotPassword";
import SignupConfirmSignup from "../../components/userComponents/SignupConfirmationPopup";
import { TwoFaSetting } from "../../components/userComponents/TwoFASetting";
import { useAuth } from "../../providers/CoginitoAuthProvider";

interface LoginFormData {
  email: string;
  passcode: string;
}

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [mfaCode, setMfaCode] = useState<string>("");

  const {
    signInWithEmail,
    showVerifyOtp,
    isOtpVerifying,
    setShowVerifyOtp,
    verifyTOTP,
    showMfaSettingModal,
    setShowMfaSettingModal,
    showVerifySignupModal,
    setShowVerifySignupModal,
    isLoading
  } = useAuth();

  const onSubmit = (values: LoginFormData) => {
    setUsername(values.email);
    signInWithEmail(values.email, values.passcode);
  };

  const onCloseConfirmationPopup = () => {
    setShowVerifySignupModal(false);
  };

  const onMFAInputChange = (code: string) => {
    setMfaCode(code);
  };

  return (
    <>
      <Loader show={isLoading || isOtpVerifying} />
      <MFAInput
        onSubmit={() => verifyTOTP(mfaCode)}
        onOtpChange={onMFAInputChange}
        isOpen={showVerifyOtp}
        onClose={() => setShowVerifyOtp(false)}
      />
      <TwoFaSetting is2FaEnabled={false} open={showMfaSettingModal} onClose={() => setShowMfaSettingModal(false)} />
      <SignupConfirmSignup isOpen={showVerifySignupModal} onClose={onCloseConfirmationPopup} username={username} />
      {/* <SignInBanner> */}
      <div className="flex justify-center items-center w-full h-screen py-4 sm:px-8 bg-white sm:bg-transparent">
        <div className="w-full max-w-lg py-4 px-4 rounded-3xl sm:px-8 sm:bg-white sm:shadow-md">
          <div className="w-full flex justify-center ">
            <img src="/logo512.png " alt="" className="w-20" />
          </div>
          <div className="mb-8 text-center">
            <h1 className="text-xl font-bold">Log in to your account</h1>
            <p className="text-secondary-foreground mt-2">
              Dont have an account?
              <Link to="/signup" className="text-primary underline ml-1">
                Sign up
              </Link>
            </p>
          </div>
          <Formik
            initialValues={{
              email: "",
              passcode: ""
            }}
            onSubmit={(values) => {
              onSubmit(values);
            }}
          >
            {({ handleSubmit, errors, touched }) => (
              <form onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <div className="space-y-4">
                    <div className={`form-control ${errors.email && touched.email ? "error" : ""}`}>
                      <Label htmlFor="email">Username*</Label>
                      <Field
                        as={Input}
                        id="email"
                        type="text"
                        placeholder="Email"
                        name="email"
                        validate={(value: string | undefined) => {
                          let error;
                          if (!value) {
                            error = "Username is required";
                          }
                          return error;
                        }}
                      />
                      {errors.email && touched.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    <div className={`form-control ${errors.passcode && touched.passcode ? "error" : ""}`}>
                      <Label htmlFor="passcode">Password*</Label>
                      <div className="relative">
                        <Field
                          as={Input}
                          id="passcode"
                          name="passcode"
                          placeholder="Password"
                          type={showPassword ? "text" : "password"}
                          validate={(value: string | undefined) => {
                            let error;
                            if (!value || value.length < 7) {
                              error = "Password must contain at least 8 characters";
                            }
                            return error;
                          }}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Mask password" : "Reveal password"}
                        >
                          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </Button>
                      </div>
                      {errors.passcode && touched.passcode && <p className="mt-2 text-sm text-red-600">{errors.passcode}</p>}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <ForgotPassword />
                  </div>

                  <div className="space-y-6 py-4">
                    <Button className="w-full" type="submit">
                      Sign in
                    </Button>
                    {/* <div className="flex items-center justify-center">
                        <hr className="flex-grow border-gray-300" />
                        <span className="mx-4 text-sm text-gray-500">or continue with</span>
                        <hr className="flex-grow border-gray-300" />
                      </div>
                      <OidcLogin /> */}
                  </div>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
      {/* </SignInBanner> */}
    </>
  );
};

export default LoginPage;
