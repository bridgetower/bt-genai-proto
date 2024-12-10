import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { Field, Formik } from "formik";
import { EyeIcon, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Loader } from "@/components/loader/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import SignupConfirmSignup from "../../components/userComponents/SignupConfirmationPopup";
import { useAuth } from "../../providers/CoginitoAuthProvider";
import { ValidateConfirmPasswords, validateEmailId } from "../../utils/validators";

interface IFormValues {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  newPassword: string;
  cnfpassword: string;
}

const Signup: React.FC = (props) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPass, setShowConfirmPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const { createAccount, showVerifySignupModal, setShowVerifySignupModal, isLoading } = useAuth();

  const submit = (values: IFormValues) => {
    setEmail(values.email);
    const attributeList = [
      // new CognitoUserAttribute({ Name: "email", Value: values.email }),
      new CognitoUserAttribute({ Name: "given_name", Value: values.firstname }),
      new CognitoUserAttribute({ Name: "family_name", Value: values.lastname })
    ];
    createAccount(values.email, values.newPassword, attributeList);
  };

  const onCloseConfirmationPopup = () => {
    setShowVerifySignupModal(false);
  };

  return (
    <>
      <Loader show={isLoading} />
      <SignupConfirmSignup isOpen={showVerifySignupModal} onClose={onCloseConfirmationPopup} username={email} />
      {/* <SignInBanner> */}
      <div className="flex justify-center items-center w-full min-h-screen py-4 sm:px-8 bg-white sm:bg-transparent">
        <div className="w-full max-w-lg py-4 px-4 rounded-3xl sm:px-8 sm:bg-white sm:shadow-md">
          <div className="w-full flex justify-center ">
            <img src="/logo512.png " alt="" className="w-20" />
          </div>
          <div className="mb-8 text-center">
            <h1 className="text-xl font-bold">Create an account</h1>
            <p className="text-secondary-foreground mt-2">
              Already have an account?{" "}
              <Link className="underline text-primary" to="/login">
                Sign in
              </Link>
            </p>
          </div>
          <Formik
            initialValues={{
              username: "",
              email: "",
              firstname: "",
              lastname: "",
              newPassword: "",
              cnfpassword: ""
            }}
            onSubmit={(values: IFormValues) => {
              submit(values);
            }}
          >
            {({ handleSubmit, errors, touched, values }: any) => (
              <form onSubmit={handleSubmit} autoComplete="off">
                <div className="space-y-6">
                  <div className="space-y-5">
                    {/* <div className={`flex flex-col space-y-2 ${touched.username && errors.username ? "text-red-500" : ""}`}>
                      <label htmlFor="username" className="font-medium">
                        Username
                      </label>
                      <Field
                        autoComplete="off"
                        as={Input}
                        width="100%"
                        id="username"
                        type="text"
                        placeholder="Unique username"
                        name="username"
                        required
                        validate={(value: string) => {
                          let error;
                          if (!value) {
                            error = "Username is mandatory!";
                          }
                          return error;
                        }}
                      />
                      {touched.username && errors.username && <div className="text-red-500 text-sm">{errors.username}</div>}
                    </div> */}

                    <div className={`flex flex-col space-y-2 ${touched.email && errors.email ? "text-red-500" : ""}`}>
                      <label htmlFor="email" className="font-medium">
                        Email
                      </label>
                      <Field
                        autoComplete="off"
                        as={Input}
                        width="100%"
                        id="email"
                        type="email"
                        placeholder="Email"
                        name="email"
                        required
                        validate={(value: string) => {
                          let error;
                          if (!validateEmailId(value)) {
                            error = "Invalid email address!";
                          }
                          return error;
                        }}
                      />
                      {touched.email && errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                    </div>

                    <div className="flex flex-col space-y-2">
                      <label htmlFor="firstname" className="font-medium">
                        First name
                      </label>
                      <Field as={Input} width="100%" id="firstname" name="firstname" placeholder="First name" />
                    </div>

                    <div className="flex flex-col space-y-2">
                      <label htmlFor="lastname" className="font-medium">
                        Last name
                      </label>
                      <Field as={Input} width="100%" id="lastname" name="lastname" placeholder="Last name" />
                    </div>

                    <div className={`flex flex-col space-y-2 ${touched.newPassword && errors.newPassword ? "text-red-500" : ""}`}>
                      <label htmlFor="newPassword" className="font-medium">
                        Password
                      </label>
                      <div className="relative">
                        <Field
                          as={Input}
                          id="newPassword"
                          name="newPassword"
                          type={showPassword || values.newPassword.length === 0 ? "text" : "password"}
                          required
                          autoComplete="off"
                          placeholder="Password"
                          className="w-full"
                          validate={(value: string) => {
                            let error;
                            if (value.length < 7) {
                              error = "Password must contain at least 8 characters";
                            }
                            return error;
                          }}
                          {...props}
                        />
                        <button
                          tabIndex={-1}
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Mask password" : "Reveal password"}
                        >
                          {showPassword ? <EyeOff /> : <EyeIcon />}
                        </button>
                      </div>
                      {touched.newPassword && errors.newPassword && <div className="text-red-500 text-sm">{errors.newPassword}</div>}
                    </div>

                    <div className={`flex flex-col space-y-2 ${touched.cnfpassword && errors.cnfpassword ? "text-red-500" : ""}`}>
                      <label htmlFor="cnfpassword" className="font-medium">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Field
                          as={Input}
                          id="cnfpassword"
                          name="cnfpassword"
                          type={showConfirmPass || values.cnfpassword.length === 0 ? "text" : "password"}
                          required
                          placeholder="Confirm password"
                          className="w-full"
                          validate={(value: string) => ValidateConfirmPasswords(values.newPassword, value)}
                          {...props}
                        />
                        <button
                          tabIndex={-1}
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPass)}
                          aria-label={showConfirmPass ? "Mask password" : "Reveal password"}
                        >
                          {showConfirmPass ? <EyeOff /> : <EyeIcon />}
                        </button>
                      </div>
                      {touched.cnfpassword && errors.cnfpassword && <div className="text-red-500 text-sm">{errors.cnfpassword}</div>}
                    </div>
                  </div>
                  <Button className="w-full" type="submit">
                    Register
                  </Button>
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

export default Signup;
