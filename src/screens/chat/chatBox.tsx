import { formatRelative } from "date-fns";
import { CopyIcon, PanelRightClose, PanelRightOpen, RefreshCcwIcon } from "lucide-react";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

// import { Popover } from "@/components/common/Popover";
import MessageLoader from "@/components/Loaders/msgLoader";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useHandleMessageSend } from "@/hooks/useHandleMessageSend";
import { useChat } from "@/store/chatStore";
import { IMessageContent } from "@/types";

import { DefaultSuggestions } from "./defaultSeggestion";

// type Message = {
//   id: number;
//   text: string;
//   sender: "me" | "other"; // 'me' for sent messages, 'other' for received messages
//   timestamp: Date;
// };

const ChatBox: React.FC = () => {
  // const allSourcesId: string[] = [];
  const [message, setMessage] = useState("");
  const handleSend = useHandleMessageSend(message, setMessage);
  // const [tooltipData, setTooltipData] = useState({ displayText: "", content: "" });
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const { chatContent, isWaitingForResponse, setShowRightPanel, showRightPanel, setJobId } = useChat();
  const [copyToClipboard] = useCopyToClipboard();
  useLayoutEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatContent]);

  console.log(chatContent);

  const regenerate = (msg: string) => {
    setMessage(msg);
  };
  useEffect(() => {
    if (message) {
      handleSend();
    }
  }, [message]);

  const replaceSourcesWithLinks = (text: string, sourceArray: string[]) => {
    const sources = sourceArray.map((source, index) => {
      // const [link, tooltip] = source.split("|");
      const link = "javascript:void(0)";
      const tooltip = source;
      return { link, tooltip };
    });
    // allSourcesId = sourceArray.map((_, i) => `Source[${i}]`);
    return text.replace(/Source\[(\d+)\]/g, (match, sourceNumber) => {
      const source = sources[sourceNumber];
      if (source) {
        return `
        <a href="${source.link}" title="${source.tooltip}" id="Source[${sourceNumber}]" class="text-blue-600 underline">Source[${sourceNumber}]</a>`;
      }
      return match;
    });
  };

  // useEffect(() => {
  //   allSourcesId.forEach((sourceId) => {
  //     const myDiv = document.getElementById(sourceId);
  //     myDiv?.addEventListener("mouseover", function () {
  //       setTooltipData({ displayText: sourceId, content:  chatContent});
  //     });
  //     myDiv?.addEventListener("mouseout", function () {
  //       // setTooltipData({ displayText: sourceId, content: "" }); // Reset color on mouseout
  //     });
  //   });
  // }, [allSourcesId]);

  // const onClosePopover = () => {
  //   setTooltipData({ displayText: "", content: "" });
  // };
  const toggleRightPanel = (msgMeta: IMessageContent) => {
    setShowRightPanel(!showRightPanel);
    setJobId(msgMeta.job_id);
  };
  return (
    <>
      {/* <Popover open={!!tooltipData.content} description={tooltipData.content} onClose={onClosePopover} /> */}
      <div className="relative">
        {/* <Tooltip id/> */}
        <div className=" h-[calc(100vh-270px)] flex flex-col w-full p-4 bg-card rounded-lg overflow-auto custom-scrollbar">
          <div className="flex-1 space-y-4">
            {chatContent.map((msg, index) => (
              <div key={index} className={`flex ${!msg.isBot ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[49%]">
                  <div
                    className={` px-4 py-2 rounded-xl shadow-md  ${!msg.isBot ? "bg-primary text-primary-foreground" : "bg-primary-foreground text-primary"}`}
                  >
                    <div
                      className="text-start text-sm font-normal pt-4 leading-6"
                      dangerouslySetInnerHTML={{ __html: replaceSourcesWithLinks(msg.message, msg.source_text || []) }}
                    ></div>
                    <div className="flex justify-end items-baseline pt-4">
                      <span className={`text-xs ${!msg.isBot ? "text-primary-foreground" : "text-primary"}`}>
                        {formatRelative(new Date(msg.timestamp), new Date())}
                      </span>
                    </div>
                  </div>
                  {msg.isBot && (
                    <div className="pt-2 flex items-center pl-4">
                      <CopyIcon
                        size={20}
                        className="text-primary cursor-copy hover:text-secondary-foreground/70 mx-2"
                        onClick={() => copyToClipboard(msg.message)}
                      />
                      <RefreshCcwIcon
                        size={20}
                        className="text-primary cursor-pointer hover:text-secondary-foreground/70 mx-2"
                        onClick={() => regenerate(msg.question)}
                      />
                      {showRightPanel ? (
                        <PanelRightClose
                          size={20}
                          className="text-primary cursor-pointer hover:text-secondary-foreground/70 mx-2"
                          onClick={() => toggleRightPanel(msg)}
                        />
                      ) : (
                        <PanelRightOpen
                          size={20}
                          className="text-primary cursor-pointer hover:text-secondary-foreground/70 mx-2"
                          onClick={() => toggleRightPanel(msg)}
                        />
                      )}
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
