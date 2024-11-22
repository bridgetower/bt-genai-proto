import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import { Button } from "@/components/ui/button";

import { Loader } from "../../components/loader/Loader";
import { useAuth } from "../../providers/CoginitoAuthProvider";

const OidcLogin: React.FC = () => {
  const { signInWithGoogle, signInWithFacebook, signInWithApple, isLoading } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const state = params.get("state");
    const code = params.get("code");
    if (state && params) {
      new BroadcastChannel("oauth_code").postMessage({
        code,
        state
      });
    }
    window.close();
  }, []);
  const handleSocialLogin = (provider: string) => {
    switch (provider) {
      case "Facebook":
        signInWithFacebook();
        break;
      case "Google":
        signInWithGoogle();
        break;
      case "Apple":
        signInWithApple();
        break;
      default:
        break;
    }
  };
  return (
    <>
      <Loader show={isLoading} />
      <Toaster />
      <div>
        <div className="flex justify-center">
          <Button onClick={() => handleSocialLogin("Facebook")}>
            <div className="flex">
              <img src="/images/icons/facebook.png" className="h-6" />
              Login with Facebook
            </div>
          </Button>
        </div>
        <div className="flex justify-center">
          <Button onClick={() => handleSocialLogin("Google")}>
            <div className="flex">
              <img src="/images/icons/google.png" className="h-6" />
              Login with Google
            </div>
          </Button>
        </div>
        <div className="flex justify-center">
          <Button>
            <div className="flex">
              <img src="/images/icons/apple.png" className="h-6" />
              Login with Apple
            </div>
          </Button>
        </div>
      </div>
    </>
  );
};

export default OidcLogin;
