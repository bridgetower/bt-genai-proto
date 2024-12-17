import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { PublicLayout } from "./components/layout";
import { ProtectedLoyout } from "./components/layout/ProtectedLayout";
import { ChatProvider } from "./providers/chatProvider";
import { AuthProvider } from "./providers/CoginitoAuthProvider";
import { ChatPage } from "./screens/chat";
import { LandingPage } from "./screens/landing/LandingPage";
import LoginPage from "./screens/login/Login";
import { MyFileRequestList } from "./screens/myRequests/MyFileRequestList";
import PageNotFound from "./screens/page-not-found/pageNotFound";
import Signup from "./screens/signup/SignUpForm";

const AppRouters: React.FC = () => {
  const router = createBrowserRouter([
    {
      element: <AuthProvider />,
      children: [
        {
          path: "/",
          element: <ProtectedLoyout />,
          errorElement: <PageNotFound />,
          children: [
            {
              path: "/",
              element: <LandingPage />
            },
            {
              path: "/chat",
              element: (
                <>
                  <ChatProvider>
                    <ChatPage />
                  </ChatProvider>
                </>
              )
            },

            {
              path: "my-file-requests",
              element: <MyFileRequestList />
            }
          ]
        },
        {
          path: "/",
          element: <PublicLayout />,
          errorElement: <PageNotFound />,
          children: [
            {
              path: "/login",
              element: <LoginPage />,
              errorElement: <PageNotFound />
            },
            {
              path: "/signup",
              element: <Signup />,
              errorElement: <PageNotFound />
            }
          ]
        },
        {
          path: "*",
          element: <PageNotFound />
        }
      ]
    }
  ]);
  return <RouterProvider router={router} />;
};

export default AppRouters;
