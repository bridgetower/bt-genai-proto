import React, { ReactNode, useState } from "react";

import { ChatContext } from "@/store/chatStore";
import { IMessageContent, SourceReference } from "@/types";

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [chatContent, setChatContent] = useState<IMessageContent[]>([]);
  const [sessionIds, setSessionIds] = useState<string[]>([]);
  const [latestSessionId, setLatestSessionId] = useState<string>("");
  const [job_id, setJobId] = useState<string>("");
  const [isWaitingForResponse, setIsWaitingForResponse] = useState<boolean>(false);
  const [showRightPanel, setShowRightPanel] = useState<"origin" | "sources" | "">("");
  const [sources, setSources] = useState<SourceReference[]>([]);
  const [activeSourceIndex, setActiveSourceIndex] = useState<number>(0);

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
    setJobId,
    sources,
    setSources,
    activeSourceIndex,
    setActiveSourceIndex
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
