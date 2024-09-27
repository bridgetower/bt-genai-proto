import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { InfoIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Input } from "../../components/ui/input";
import { useAuth } from "../../providers/CoginitoAuthProvider";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export const ProfileUpdateForm: React.FC = () => {
  // const user = getThisUser();
  const [firstName, setFirstName] = useState("Test");
  const [lastName, setLastName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const { updateUserAttributes, usersession } = useAuth();
  useEffect(() => {
    const userDetail = usersession?.getIdToken().payload;

    if (userDetail) {
      // getCognitoUserData(userDetail.email);
      setFirstName(userDetail.given_name);
      setLastName(userDetail.family_name);
      setUserEmail(userDetail.email);
    }
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    //update user profile here
    const attributes = [
      {
        Name: "given_name",
        Value: firstName
      },
      {
        Name: "family_name",
        Value: lastName
      }
    ];
    const attributeList: CognitoUserAttribute[] = [];
    attributes.forEach((att) => {
      const data = {
        Name: att.Name,
        Value: att.Value
      };
      const attribute = new CognitoUserAttribute(data);
      attributeList.push(attribute);
    });
    updateUserAttributes(attributeList);
    // toast.error("Not implemented yet");
  };

  return (
    <>
      <div className="bg-card rounded-xl px-2">
        <form onSubmit={submit}>
          <div>
            <div className="flex items-center">
              <Label htmlFor="email" className="my-2">
                Email
              </Label>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="ml-1">
                      <InfoIcon />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Email Id can&apos;t be change/update.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input width="100%" id="email" type="email" placeholder="" name="email" value={userEmail} disabled />
          </div>

          <div className="pt-4">
            <Label htmlFor="fname">First Name</Label>

            <Input
              width="100%"
              id="fname"
              name="fname"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="pt-4">
            <Label htmlFor="lname">Last Name</Label>

            <Input
              width="100%"
              id="lname"
              name="lname"
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="mt-6 flex justify-center">
            <Button type="submit">Update</Button>
          </div>
        </form>
      </div>
    </>
  );
};
