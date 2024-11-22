import React, { createContext, useContext } from "react";

import { IMessageContent, SourceReference } from "@/types";

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
  showRightPanel: "origin" | "sources" | "";
  setShowRightPanel: React.Dispatch<React.SetStateAction<"origin" | "sources" | "">>;
  job_id: string;
  setJobId: React.Dispatch<React.SetStateAction<string>>;

  sources: SourceReference[];
  setSources: React.Dispatch<React.SetStateAction<SourceReference[]>>;
  activeSourceIndex: number;
  setActiveSourceIndex: React.Dispatch<React.SetStateAction<number>>;
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
