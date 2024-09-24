import React, { useEffect } from "react";

import RightDrawer from "@/components/common/rightDrawer";
import { useChat } from "@/store/chatStore";

import ChatBox from "./chatBox";
import { ChatHeader } from "./chatHeader";
import { ChatInputContainer } from "./chatInputContainer";
import TransactionPanel from "./transactionPanel";

export const ChatPage: React.FC = () => {
  const { sessionIds, setSessionIds, setLatestSessionId, chatContent, showRightPanel, setShowRightPanel } = useChat();

  useEffect(() => {
    const newSessionid = "initial-" + Math.random().toString(36).substring(2, 11);
    setSessionIds([...sessionIds, newSessionid]);
    setLatestSessionId(newSessionid);
  }, []);
  const togglePanel = () => {
    setShowRightPanel(!showRightPanel);
  };

  return (
    <div>
      <ChatHeader />
      <div className="p-4 pb-0">
        <div className="">
          {/* Chat messages go here */}
          {React.useMemo(() => {
            return <ChatBox />;
          }, [chatContent])}
        </div>
        <div className="">
          <ChatInputContainer />
        </div>
      </div>
      <RightDrawer onClose={togglePanel} isOpen={showRightPanel}>
        <TransactionPanel chainType="Avalanche" transactionHash="0x1640972dc53ddfe901f1edf9ce28797c2196e2e90add92e467d7bbf80c1626cb" />
      </RightDrawer>
    </div>
  );
};
