import React, { createContext, useContext } from "react";

import { IMessageContent } from "@/types";

// Define the types for the context
interface ChatContextType {
  chatContent: IMessageContent[];
  setChatContent: React.Dispatch<React.SetStateAction<IMessageContent[]>>;
  sessionIds: string[];
  setSessionIds: React.Dispatch<React.SetStateAction<string[]>>;
  latestSessionId: string;
  setLatestSessionId: React.Dispatch<React.SetStateAction<string>>;
  isWaitingForResponse: boolean;
  setIsWaitingForResponse: React.Dispatch<React.SetStateAction<boolean>>;
  showRightPanel: boolean;
  setShowRightPanel: React.Dispatch<React.SetStateAction<boolean>>;
  job_id: string;
  setJobId: React.Dispatch<React.SetStateAction<string>>;
}

// Create the context with a default value
export const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Create a custom hook to use the ChatContext
export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
