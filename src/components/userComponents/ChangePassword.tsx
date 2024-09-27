import { Field, Formik } from "formik";
import React from "react";

import { Input } from "../../components/ui/input";
import { useAuth } from "../../providers/CoginitoAuthProvider";
import { ValidateConfirmPasswords } from "../../utils/validators";
import { Loader } from "../loader/Loader";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogOverlay } from "../ui/dialog";
import { Separator } from "../ui/separator";

type changePasswordProps = {
  open: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
};
interface IFormValues {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
export const ChangePassword: React.FC<changePasswordProps> = ({ open, onClose }) => {
  const { changePassword, usersession, isLoading } = useAuth();

  const onSubmitHandler = async (values: IFormValues) => {
    const userDetail = usersession?.getIdToken().payload;
    const userName = userDetail?.email;
    changePassword(userName, values.oldPassword, values.newPassword);
  };

  return (
    <>
      <Loader show={isLoading} />
      <Dialog open={open} onOpenChange={() => onClose(false)} modal>
        <DialogOverlay />

        <DialogContent className="bg-white max-w-sm">
          <Formik
            initialValues={{
              oldPassword: "",
              newPassword: "",
              confirmNewPassword: ""
            }}
            onSubmit={(values) => {
              onSubmitHandler(values);
            }}
          >
            {({ handleSubmit, errors, touched, values }) => (
              <form onSubmit={handleSubmit}>
                <DialogHeader className="text-h3 font-bold text-center">Update password</DialogHeader>
                <DialogClose />
                <Separator />
                <div className="py-4">
                  <div className="pt-4">
                    <label htmlFor="oldPassword" className="font-medium">
                      Current password
                    </label>
                    <Field
                      as={Input}
                      width={"100%"}
                      id="oldPassword"
                      type="password"
                      htmlFor="oldPassword"
                      placeholder="Enter current password"
                      name="oldPassword"
                      autoFocus={true}
                      required
                      validate={(value: string) => {
                        let error;
                        if (value.length < 7) {
                          error = "Password must contain at least 8 characters";
                        }
                        return error;
                      }}
                    />
                  </div>
                  <div className="pt-4">
                    <label htmlFor="newPassword" className="font-medium">
                      New password
                    </label>
                    <Field
                      as={Input}
                      width={"100%"}
                      id="newPassword"
                      type="password"
                      htmlFor="newPassword"
                      placeholder="Enter new password"
                      name="newPassword"
                      required
                      validate={(value: string) => {
                        let error;
                        if (value.length < 7) {
                          error = "Password must contain at least 8 characters";
                        }
                        return error;
                      }}
                    />
                    {touched.newPassword && errors.newPassword && <div className="text-red-500 text-sm">{errors.newPassword}</div>}
                  </div>
                  <div className="pt-4">
                    <label htmlFor="confirmNewPassword" className="font-medium">
                      New password
                    </label>
                    <Field
                      as={Input}
                      width={"100%"}
                      id="confirmNewPassword"
                      type="password"
                      htmlFor="confirmNewPassword"
                      placeholder="Enter new password again"
                      name="confirmNewPassword"
                      required
                      validate={(value: string) => ValidateConfirmPasswords(values.newPassword, value)}
                    />
                    {touched.confirmNewPassword && errors.confirmNewPassword && (
                      <div className="text-red-500 text-sm">{errors.confirmNewPassword}</div>
                    )}
                  </div>
                </div>
                <DialogFooter className="gap-y-2 text-center">
                  <div className="flex justify-between w-full">
                    <Button variant={"outline"} onClick={() => onClose(false)}>
                      Cancel{" "}
                    </Button>
                    <Button type="submit" className="ml-1">
                      Update{" "}
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </>
  );
};
