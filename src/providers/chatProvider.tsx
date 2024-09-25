import React, { ReactNode, useState } from "react";

import { ChatContext } from "@/store/chatStore";
import { IMessageContent } from "@/types";

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [chatContent, setChatContent] = useState<IMessageContent[]>([]);
  const [sessionIds, setSessionIds] = useState<string[]>([]);
  const [latestSessionId, setLatestSessionId] = useState<string>("");
  const [job_id, setJobId] = useState<string>("");
  const [isWaitingForResponse, setIsWaitingForResponse] = useState<boolean>(false);
  const [showRightPanel, setShowRightPanel] = useState<boolean>(false);

  const value = {
    chatContent,
    setChatContent,
    sessionIds,
    setSessionIds,
    latestSessionId,
    setLatestSessionId,
    isWaitingForResponse,
    setIsWaitingForResponse,
    showRightPanel,
    setShowRightPanel,
    job_id,
    setJobId
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
