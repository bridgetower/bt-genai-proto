import { formatRelative } from "date-fns";
import { CopyIcon, PanelRightClose, PanelRightOpen, RefreshCcwIcon } from "lucide-react";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

import { TooltipComponent } from "@/components/common/tooltip";
import MessageLoader from "@/components/Loaders/msgLoader";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useHandleMessageSend } from "@/hooks/useHandleMessageSend";
import { useChat } from "@/store/chatStore";
import { IMessageContent, SourceReference } from "@/types";

import { DefaultSuggestions } from "./defaultSeggestion";

interface Source {
  link: string;
  tooltip: string;
}

const SourceLink: React.FC<{
  source: Source;
  index: number;
  onClickHandler: (sourceArray: SourceReference[], index: number) => void;
  sourceReference: SourceReference[];
}> = ({ source, index, onClickHandler, sourceReference }) => (
  <a
    href={source.link}
    title={source.tooltip}
    id={`source-${index}`}
    className="text-[#1890FF] underline"
    onClick={(e) => {
      e.preventDefault();
      onClickHandler(sourceReference, index);
    }}
  >
    Source[{index}]
  </a>
);

const MessageContent: React.FC<{
  message: string;
  sourceArray: string[];
  sourceReference: SourceReference[];
  onClickHandler: (sourceReference: SourceReference[], index: number) => void;
}> = ({ message, sourceArray, sourceReference, onClickHandler }) => {
  const sources = sourceArray.map((source) => ({
    link: "javascript:void(0)",
    tooltip: source
  }));

  const parts = message.split(/Source\[(\d+)\]/g);

  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 0) return part;
        const index = parseInt(part, 10);
        if (index < 0 || index >= sources.length) return `Source[${part}]`;
        return (
          <SourceLink
            key={`source-${index}`}
            sourceReference={sourceReference}
            source={sources[index]}
            index={index}
            onClickHandler={onClickHandler}
          />
        );
      })}
    </>
  );
};

const ChatBox: React.FC = () => {
  const [message, setMessage] = useState("");
  const handleSend = useHandleMessageSend(message, setMessage);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const { chatContent, isWaitingForResponse, setShowRightPanel, showRightPanel, setJobId, setActiveSourceIndex, setSources } = useChat();
  const [copyToClipboard] = useCopyToClipboard();

  useLayoutEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatContent]);

  const regenerate = (msg: string) => {
    setMessage(msg);
  };

  useEffect(() => {
    if (message) {
      handleSend();
    }
  }, [message]);

  const handleSourceClick = (sourceArray: SourceReference[], index: number) => {
    // console.log("Source clicked", sourceArray, index);
    setActiveSourceIndex(index - 1);
    setSources(sourceArray);
    setShowRightPanel("sources");
  };

  const showProofOfOriginPanel = (msgMeta: IMessageContent) => {
    setShowRightPanel("origin");
    setJobId(msgMeta.job_id);
  };

  return (
    <>
      <div className="relative">
        <div className="h-[calc(100vh-270px)] flex flex-col w-full p-4 bg-card rounded-lg overflow-auto custom-scrollbar">
          <div className="flex-1 space-y-4">
            {chatContent.map((msg, index) => (
              <div key={index} className={`flex ${!msg.isBot ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[49%]">
                  <div
                    className={`px-4 py-2 rounded-xl shadow-md ${
                      !msg.isBot ? "bg-primary text-primary-foreground" : "bg-primary-foreground text-primary"
                    }`}
                  >
                    <div className="text-start text-base font-normal pt-4">
                      <MessageContent
                        message={msg.message}
                        sourceArray={msg.source_text || []}
                        sourceReference={msg.sourceReference || []}
                        onClickHandler={handleSourceClick}
                      />
                    </div>
                    <div className="flex justify-end items-baseline pt-4">
                      <span className={`text-xs ${!msg.isBot ? "text-primary-foreground" : "text-primary"}`}>
                        {formatRelative(new Date(msg.timestamp), new Date())}
                      </span>
                    </div>
                  </div>
                  {msg.isBot && (
                    <div className="pt-2 flex items-center pl-4">
                      <TooltipComponent
                        content="Copy"
                        displayText={
                          <CopyIcon
                            size={20}
                            className="text-primary cursor-pointer hover:text-secondary-foreground/70 mx-2"
                            onClick={() => copyToClipboard(msg.message)}
                          />
                        }
                      />
                      <TooltipComponent
                        content="Regenerate"
                        displayText={
                          <RefreshCcwIcon
                            size={20}
                            className="text-primary cursor-pointer hover:text-secondary-foreground/70 mx-2"
                            onClick={() => regenerate(msg.question)}
                          />
                        }
                      />
                      <TooltipComponent
                        content="Proof of origin"
                        displayText={
                          showRightPanel ? (
                            <PanelRightClose
                              size={20}
                              className="text-primary cursor-pointer hover:text-secondary-foreground/70 mx-2"
                              onClick={() => showProofOfOriginPanel(msg)}
                            />
                          ) : (
                            <PanelRightOpen
                              size={20}
                              className="text-primary cursor-pointer hover:text-secondary-foreground/70 mx-2"
                              onClick={() => showProofOfOriginPanel(msg)}
                            />
                          )
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isWaitingForResponse && <MessageLoader />}
            <div ref={lastMessageRef}></div>
          </div>
        </div>

        <div className="sticky -bottom-4 mt-2">
          <DefaultSuggestions />
        </div>
      </div>
    </>
  );
};

export default ChatBox;
