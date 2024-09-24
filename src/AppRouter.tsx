import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { PublicLayout } from "./components/layout";
import { ChatProvider } from "./providers/chatProvider";
import { ChatPage } from "./screens/chat";
import PageNotFound from "./screens/page-not-found/pageNotFound";

const AppRouters: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <PublicLayout />,
      errorElement: <PageNotFound />,
      children: [
        {
          path: "/",
          element: (
            <>
              <ChatProvider>
                <ChatPage />
              </ChatProvider>
            </>
          )
        }
      ]
    },
    {
      path: "*",
      element: <PageNotFound />
    }
  ]);
  return <RouterProvider router={router} />;
};

export default AppRouters;
