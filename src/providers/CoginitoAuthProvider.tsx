import {
  AuthenticationDetails,
  CognitoAccessToken,
  CognitoIdToken,
  CognitoRefreshToken,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
  ICognitoUserPoolData
} from "amazon-cognito-identity-js";
import { jwtDecode } from "jwt-decode";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Outlet, useNavigate } from "react-router-dom";

import ErrorPopup from "../components/errorAlert/ErrorPopup";

// Define the User interface based on your specific requirements
interface Identity {
  dateCreated: string;
  userId: string;
  providerName: string;
  providerType: string;
  issuer: string | null;
  primary: string;
}

interface ICognitoUser {
  at_hash: string;
  sub: string;
  "cognito:groups": string[];
  email_verified: boolean;
  iss: string;
  "cognito:username": string;
  given_name: string;
  nonce: string;
  picture: string;
  origin_jti: string;
  aud: string;
  identities: Identity[];
  token_use: string;
  auth_time: number;
  exp: number;
  iat: number;
  family_name: string;
  jti: string;
  email: string;
}

export interface AuthContextProps {
  user: ICognitoUser | null;
  error: any;
  isLoading: boolean;
  isOtpVerifying: boolean;
  isAuthenticated: boolean;
  showVerifyOtp: boolean;
  showMfaSettingModal: boolean;
  mfaAuthUrl: string;
  showVerifySignupModal: boolean;
  updateUserAttributes: (attributeList: CognitoUserAttribute[]) => void;
  setShowVerifySignupModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowMfaSettingModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowVerifyOtp: React.Dispatch<React.SetStateAction<boolean>>;
  createAccount: (username: string, password: string, attributes: CognitoUserAttribute[]) => void;
  signInWithEmail: (email: string, password: string) => void;
  logout: () => void;
  resendConfirmationCode: (email: string) => void;
  verifyConfirmationCode: (username: string, code: string, onClose: () => void) => void;
  signInWithGoogle: () => void;
  signInWithApple: () => void;
  signInWithFacebook: () => void;
  forgotPassword: (email: string) => void;
  resetPassword: (username: string, code: string, newPassword: string) => void;
  verifyTOTP: (code: string) => void;
  verifyAssociateSoftwareToken: (code: string) => void;
  changePassword: (username: string, oldPassword: string, newPassword: string) => void;
  isCheckingAuth: boolean;
  usersession: CognitoUserSession | null | undefined;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const redirect_uri: string = new URL("/login", window.location.href).toString();

const poolData: ICognitoUserPoolData = {
  UserPoolId: process.env.REACT_APP_COGNITO_POOL_ID || "", //env variables
  ClientId: process.env.REACT_APP_POOL_CLIENT_ID || "" //env variables
};

const userPool = new CognitoUserPool(poolData);

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<ICognitoUser | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOtpVerifying, setIsOtpVerifying] = useState<boolean>(false);
  const [showVerifyOtp, setShowVerifyOtp] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [coginitoUser, setCognitoUser] = useState<CognitoUser>();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [mfaAuthUrl, setMfaAuthUrl] = useState<string>("");
  const [showMfaSettingModal, setShowMfaSettingModal] = useState<boolean>(false);
  const [showVerifySignupModal, setShowVerifySignupModal] = useState<boolean>(false);
  const [usersession, setUserSession] = useState<CognitoUserSession | null | undefined>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const error_description = params.get("error_description");
    if (error_description) {
      // toast.dismiss();
      const err = error_description ? error_description.split(":")[1] : error_description;
      // toast.error(err);
      setError(err);
      return;
    }

    const fetchTokenFromCode = async (code: string) => {
      // setIsLoading(true);
      try {
        const response = await fetch(`https://${process.env.REACT_APP_OAUTH_DOMAIN}/oauth2/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            code,
            grant_type: "authorization_code",
            client_id: process.env.REACT_APP_POOL_CLIENT_ID!,
            redirect_uri
          })
        });

        if (!response.ok) {
          throw new Error("Failed to fetch token");
        }

        const data = await response.json();
        handleUserSession(data);
        setIsAuthenticated(true);
        navigate("/");

        // Handle the data
      } catch (error) {
        console.log(error);
        // toast.error("Failed to fetch token");
        // Handle the error
      } finally {
        window.close();
        // setIsLoading(false);
      }
    };
    if (code) {
      fetchTokenFromCode(code);
      new BroadcastChannel("oauth_code").postMessage({
        code
      });
    }
  }, []);
  // Function for getting the user from session storage and setting it to local state
  useEffect(() => {
    const getSessionUser = async () => {
      try {
        setIsCheckingAuth(true);
        const cognitoUser: CognitoUser | null = userPool.getCurrentUser();
        const session = cognitoUser?.getSignInUserSession();
        setUserSession(session);
        const token = session?.getIdToken().getJwtToken();
        if (token) {
          const user = (await jwtDecode(token)) as ICognitoUser;
          setUser(user);
          console.log("user-------", user);
        }
      } finally {
        setIsCheckingAuth(false);
      }
    };
    getSessionUser();
  }, [user]);

  // Function to restore user session on page reload
  const restoreSession = () => {
    const currentUser = userPool.getCurrentUser();

    if (currentUser) {
      currentUser.getSession((err: any, session: CognitoUserSession | null) => {
        if (err) {
          console.error("Error retrieving session:", err);
          setIsAuthenticated(false);
        } else if (session && session.isValid()) {
          setUserSession(session);
          setIsAuthenticated(true);
        }
      });
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  const handleUserSession = (tokens: { access_token: string; id_token: string; refresh_token?: string }) => {
    const userData = {
      Username: "SOCIAL_LOGIN_USER", // Placeholder username as it's a federated login
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);
    let RefreshToken;
    try {
      RefreshToken = tokens.refresh_token ? new CognitoRefreshToken({ RefreshToken: tokens.refresh_token }) : undefined;
    } catch (error) {
      console.error("Error creating refresh token:", error);
    }
    RefreshToken = tokens.refresh_token ? new CognitoRefreshToken({ RefreshToken: tokens.refresh_token }) : undefined;
    const sessionData = {
      IdToken: new CognitoIdToken({ IdToken: tokens.id_token }),
      AccessToken: new CognitoAccessToken({ AccessToken: tokens.access_token }),
      RefreshToken: RefreshToken
    };
    const userSession = new CognitoUserSession(sessionData);
    cognitoUser.setSignInUserSession(userSession);
    // Now you can use the cognitoUser object to manage the session
    console.log("User session set:", cognitoUser.getSignInUserSession());
  };

  // Function for signing in with email and password
  const signInWithEmail = async (username: string, password: string) => {
    setIsLoading(true);
    const authDetails = new AuthenticationDetails({
      Username: username,
      Password: password
    });
    const userData = {
      Username: username,
      Pool: userPool
    };

    const newUser = new CognitoUser(userData);
    setCognitoUser(newUser);

    newUser.authenticateUser(authDetails, {
      onSuccess: (session) => {
        // Store the user data in localStorage
        try {
          setUserSession(session);
          setIsAuthenticated(true);
          navigate("/");
        } catch (error) {
          console.error("Error storing user data:", error);
        } finally {
          setIsLoading(false);
        }
      },
      onFailure: (err) => {
        if (err.code === "UserNotConfirmedException") {
          resendConfirmationCode(username);
          // navigate("/verifyemail");
        }
        // toast.error(err?.message || JSON.stringify(err));
        setError(err?.message || JSON.stringify(err));
        setIsLoading(false);
      },

      mfaSetup(challengeName) {
        if (challengeName === "MFA_SETUP") {
          newUser.associateSoftwareToken({
            associateSecretCode: (secretCode) => {
              // navigate("setuptotp?secretCode=" + secretCode + "&username=" + username);
              const otpauthUrl = `otpauth://totp/${encodeURIComponent("Meadowland")}:${encodeURIComponent(username ?? "")}?secret=${secretCode}&issuer=${encodeURIComponent("Meadowland.com")}`;
              setMfaAuthUrl(otpauthUrl);
              setShowMfaSettingModal(true);
              setIsLoading(false);
            },
            onFailure: (err) => {
              setIsLoading(false);
              toast.error(err?.message || JSON.stringify(err));
            }
          });
        }
        if (challengeName === "SOFTWARE_TOKEN_MFA") {
          setIsLoading(false);
          setShowVerifyOtp(true);
          // navigate("verifyotp?username=" + username);
        }
      },
      totpRequired: (challengeName) => {
        if (challengeName === "SOFTWARE_TOKEN_MFA") {
          setIsLoading(false);
          setShowVerifyOtp(true);
          // navigate("verifyotp?username=" + username);
        }
      }
    });
  };

  const verifyAssociateSoftwareToken = (code: string) => {
    setIsOtpVerifying(true);
    coginitoUser?.verifySoftwareToken(code, "", {
      onSuccess: (session) => {
        setUserSession(session);
        setIsAuthenticated(true);
        setIsOtpVerifying(false);
        setShowMfaSettingModal(false);
        navigate("/"); // Redirect to the tabs page after successful login
      },
      onFailure: (err) => {
        // toast.error(err?.message);
        setError(err?.message || JSON.stringify(err));
        setIsLoading(false);
        setIsOtpVerifying(false);
      }
    });
  };

  // Function for verifying the SOFTWARE_TOKEN_MFA challenge
  const verifyTOTP = (code: string) => {
    setIsOtpVerifying(true);
    coginitoUser?.sendMFACode(
      code,
      {
        onSuccess: (session) => {
          try {
            setUserSession(session);
            setIsAuthenticated(true);
            navigate("/");
          } catch (error) {
            console.error("Error storing user data:", error);
          } finally {
            setIsOtpVerifying(false);
          }
        },
        onFailure: (err) => {
          // toast.error(err?.message);
          setError(err?.message || JSON.stringify(err));
          setIsOtpVerifying(false);
        }
      },
      "SOFTWARE_TOKEN_MFA"
    );
  };

  function oauth2PKCELogin(authEndpoint: string, tokenEndpoint: string, client_id: string, scope: string, identityProvider: string) {
    const params = new URLSearchParams({
      identity_provider: identityProvider,
      response_type: "code",
      client_id,
      scope,
      redirect_uri,
      prompt: "select_account"
    });

    const authorizeURL = `${authEndpoint}?${params}`;
    console.log(authorizeURL);

    window.location.assign(authorizeURL);
  }

  const signInWithSocial = (identityProvider: string) => {
    try {
      setIsLoading(true);
      const authEndpoint = `https://${process.env.REACT_APP_OAUTH_DOMAIN}/oauth2/authorize`;
      const tokenEndpoint = `https://${process.env.REACT_APP_OAUTH_DOMAIN}/oauth2/token`;
      const clientId = process.env.REACT_APP_POOL_CLIENT_ID!;
      const scope = "openid profile email";

      oauth2PKCELogin(authEndpoint, tokenEndpoint, clientId, scope, identityProvider);
    } catch (err: any) {
      // toast.error(err?.message || JSON.stringify(err));
      console.error(err);
      setError(err?.message || JSON.stringify(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Function for signing in with Google
  const signInWithGoogle = () => {
    signInWithSocial("Google");
  };

  // Function for signing in with Facebook
  const signInWithFacebook = () => {
    signInWithSocial("Facebook");
  };

  // Function for signing in with Apple
  const signInWithApple = () => {
    signInWithSocial("SignInWithApple");
  };

  // Function for creating a new account
  const createAccount = (username: string, password: string, newAttributeList: { Name: string; Value: string }[]) => {
    setIsLoading(true);
    const attributeList: any[] = [];
    // const dataEmail = {
    //   Name: "email",
    //   Value: username
    // };
    // const attributeEmail = new CognitoUserAttribute(dataEmail);
    // attributeList.push(attributeEmail);
    newAttributeList.forEach((att) => {
      const data = {
        Name: att.Name,
        Value: att.Value
      };
      const attribute = new CognitoUserAttribute(data);
      attributeList.push(attribute);
    });
    userPool.signUp(username, password, attributeList, [], (err, result) => {
      if (err) {
        console.log(err);

        // toast.error(err?.message || JSON.stringify(err));
        setError(err?.message || JSON.stringify(err));
        setIsLoading(false);
      } else {
        console.log(result);

        setIsLoading(false);
        setShowVerifySignupModal(true);
        toast.success("Account created successfully");
        if (!result?.userConfirmed) {
          setIsAuthenticated(true);
        }
      }
    });
  };

  // Function for resending the confirmation code
  const resendConfirmationCode = (email: string) => {
    const userData = {
      Username: email,
      Pool: userPool
    };

    const cognitoUser = new CognitoUser(userData);
    cognitoUser.resendConfirmationCode((err) => {
      if (err) {
        toast.error("Failed to resend confirmation code");
        return;
      }
      toast.success("Confirmation code sent successfully");
      setShowVerifySignupModal(true);
    });
  };

  // Function for verifying the confirmation code
  const verifyConfirmationCode = (username: string, code: string, onClose: () => void) => {
    setIsLoading(true);
    const userData = {
      Username: username,
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(code, true, (err) => {
      if (err) {
        setError(err);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        navigate("/");
        toast.success("Signup confirmed successfully, you can now login");
        onClose();
      }
    });
  };

  // Function for initiating the forgot password flow
  const forgotPassword = (username: string) => {
    setIsLoading(true);
    const userData = {
      Username: username,
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.forgotPassword({
      onSuccess: () => {
        setIsLoading(false);
        navigate("resetpassword?username=" + username);
      },
      onFailure: (err) => {
        // toast.error(err?.message || JSON.stringify(err));
        setError(err?.message || JSON.stringify(err));
        setIsLoading(false);
      }
    });
  };

  // Function for resetting the password
  const resetPassword = (username: string, code: string, newPassword: string) => {
    setIsLoading(true);
    const userData = {
      Username: username,
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmPassword(code, newPassword, {
      onSuccess: () => {
        setIsLoading(false);
        toast.success("Password reset successfully");
        navigate("/"); // Redirect to the login page after successful password reset
      },
      onFailure: (err) => {
        // toast.error(err?.message || JSON.stringify(err));
        setError(err?.message || JSON.stringify(err));
        setIsLoading(false);
      }
    });
  };

  /**
   * Function for changing the password
   * @param username
   * @param code
   * @param newPassword
   */
  const changePassword = (username: string, oldPassword: string, newPassword: string) => {
    setIsLoading(true);
    const userData = {
      Username: username,
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.changePassword(oldPassword, newPassword, (err: Error | undefined, result: "SUCCESS" | undefined) => {
      if (result) {
        setIsLoading(false);
        toast.success("Password updated successfully");
      } else {
        // toast.error(err?.message || JSON.stringify(err));
        setError(err?.message || JSON.stringify(err));
        setIsLoading(false);
      }
    });
  };
  function removeSession() {
    const params = new URLSearchParams({
      client_id: process.env.REACT_APP_POOL_CLIENT_ID!,
      logout_uri: redirect_uri
    });

    const authorizeURL = ` https://${process.env.REACT_APP_OAUTH_DOMAIN}/logout?${params}`;
    window.location.assign(authorizeURL);
  }

  // Function for logging out the user
  const logout = () => {
    try {
      const cognitoUser = userPool.getCurrentUser();
      if (cognitoUser) {
        // LocalStorageService.removeItem("bt-customer");
        localStorage.clear();
        cognitoUser.signOut(() => {
          setIsAuthenticated(false);
          removeSession();
          navigate("/login");
        });
      }
    } catch (error) {
      console.error("Error removing user data:", error);
    }
  };
  const updateUserAttributes = (attributeList: CognitoUserAttribute[]) => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser?.updateAttributes(attributeList, (err) => {
        if (err) {
          // toast.error(err?.message || JSON.stringify(err));
          setError(err?.message || JSON.stringify(err));
          setIsLoading(false);
        } else {
          setIsLoading(false);
          toast.success("Account updated successfully");
        }
      });
    }
  };
  // const getCurrentUserSession = (): Promise<CognitoUserSession | null> => {
  //   const cognitoUser = userPool.getCurrentUser();

  //   if (!cognitoUser) {
  //     return Promise.resolve(null);
  //   }

  //   return new Promise((resolve, reject) => {
  //     cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve(session);
  //       }
  //     });
  //   });
  // };
  // const getCurrentUserSession = (): Promise<CognitoUserSession | null> => {
  //   const cognitoUser = userPool.getCurrentUser();

  //   if (!cognitoUser) {
  //     return Promise.resolve(null);
  //   }

  //   return new Promise((resolve, reject) => {
  //     cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve(session);
  //       }
  //     });
  //   });
  // };

  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        isLoading,
        isCheckingAuth,
        isOtpVerifying,
        isAuthenticated,
        showVerifyOtp,
        mfaAuthUrl,
        showMfaSettingModal,
        showVerifySignupModal,
        usersession,
        updateUserAttributes,
        setShowVerifySignupModal,
        setShowMfaSettingModal,
        setShowVerifyOtp,
        createAccount,
        logout,
        signInWithEmail,
        resendConfirmationCode,
        verifyConfirmationCode,
        signInWithGoogle,
        signInWithFacebook,
        signInWithApple,
        forgotPassword,
        resetPassword,
        verifyTOTP,
        verifyAssociateSoftwareToken,
        changePassword
      }}
    >
      {/* <Loader show={isCheckingAuth} /> */}
      <ErrorPopup open={!!error} message={error} onClose={() => setError("")} />
      <Toaster />
      {children ? children : <Outlet />}
    </AuthContext.Provider>
  );
};

// Custom hook to use the authentication context
export const useAuth = (): AuthContextProps => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return authContext;
};
