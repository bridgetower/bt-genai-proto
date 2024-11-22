import React, { useEffect } from "react";

import RightDrawer from "@/components/common/rightDrawer";
import { useChat } from "@/store/chatStore";

import ChatBox from "./chatBox";
import { ChatHeader } from "./chatHeader";
import { ChatInputContainer } from "./chatInputContainer";
import { Sources } from "./Sources";
import TransactionPanel from "./transactionPanel";

export const ChatPage: React.FC = () => {
  const {
    sessionIds,
    setSessionIds,
    setLatestSessionId,
    chatContent,
    showRightPanel,
    setShowRightPanel,
    job_id,
    activeSourceIndex,
    sources
  } = useChat();
  // const { fetch, data } = useGetBlockchainTxData("BWEcqmrhGp");
  useEffect(() => {
    const newSessionid = "initial-" + Math.random().toString(36).substring(2, 11);
    setSessionIds([...sessionIds, newSessionid]);
    setLatestSessionId(newSessionid);
  }, []);
  const togglePanel = (name: "origin" | "sources" | "") => {
    setShowRightPanel(showRightPanel ? "" : name); // toggle the panel
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
      <RightDrawer onClose={togglePanel} isOpen={showRightPanel === "origin"} title="Proof of origin">
        <TransactionPanel job_id={job_id} />
      </RightDrawer>
      <RightDrawer onClose={togglePanel} isOpen={showRightPanel === "sources"} title="Proof of origin">
        <Sources activeIndex={activeSourceIndex} sourceArray={sources} />
      </RightDrawer>
    </div>
  );
};
