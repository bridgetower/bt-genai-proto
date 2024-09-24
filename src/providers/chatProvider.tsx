import React, { ReactNode, useState } from "react";

import { ChatContext } from "@/store/chatStore";
import { IMessageContent, ITransactionData } from "@/types";

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [chatContent, setChatContent] = useState<IMessageContent[]>([]);
  const [sessionIds, setSessionIds] = useState<string[]>([]);
  const [latestSessionId, setLatestSessionId] = useState<string>("");
  const [isWaitingForResponse, setIsWaitingForResponse] = useState<boolean>(false);
  const [showRightPanel, setShowRightPanel] = useState<boolean>(false);
  const [transactionData, setTransactionData] = useState<ITransactionData | null>(null);

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
    transactionData,
    setTransactionData
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
