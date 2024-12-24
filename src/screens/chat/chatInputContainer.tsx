// import axios from "axios";
import { PaperclipIcon, Send } from "lucide-react";
import React, { useState } from "react";

import { useHandleMessageSend } from "@/hooks/useHandleMessageSend";

import { AddFilesDialog } from "../myRequests/uploadFiles";
// import { useChat } from "@/store/chatStore";

export const ChatInputContainer: React.FC = () => {
  // const projectId = localStorage.getItem("projectId") || "";
  const [message, setMessage] = useState("");
  const [showAddFileModal, setShowAddFileModal] = useState(false);
  const handleSend = useHandleMessageSend(message, setMessage);
  //   const { latestSessionId, setIsWaitingForResponse, setLatestSessionId, setChatContent } = useChat();

  //   const handleSend = () => {
  //     if (message.trim() !== "") {
  //       setIsWaitingForResponse(true);
  //       setChatContent((pre) => [...pre, { message, isBot: false, timestamp: Date.now() }]);
  //       axios
  //         .post(
  //           `https://ine4p5pejlqlbcblnwodntx4qm0ytdwg.lambda-url.us-east-1.on.aws/`,
  //           {
  //             sessionId: latestSessionId,
  //             message: message
  //           },
  //           {
  //             headers: {
  //               "Content-Type": "application/json"
  //             }
  //           }
  //         )
  //         .then((res) => {
  //           if (res.status === 200) {
  //             console.log(res.data);
  //             setLatestSessionId(res.data.sessionId);
  //             setChatContent((pre) => [...pre, { ...res.data, isBot: true, timestamp: Date.now() }]);
  //           }
  //         })
  //         .catch((e) => {
  //           console.log("Handle send msg", e);
  //         })
  //         .finally(() => {
  //           setIsWaitingForResponse(false);
  //         });

  //       setMessage(""); // Clear the input after sending
  //     }
  //   };
  const toggleAddFileModal = () => {
    setShowAddFileModal(!showAddFileModal);
  };
  return (
    <>
      {" "}
      <AddFilesDialog onAfterUpload={() => {}} isOpen={showAddFileModal} setIsOpen={setShowAddFileModal} />
      <div className="flex items-center p-3 mt-4 bg-primary-foreground border-t border-primary">
        <button className="text-primary hover:text-gray-700 p-2" onClick={() => toggleAddFileModal()}>
          <PaperclipIcon size={20} />
        </button>
        <input
          type="text"
          placeholder="Type a message"
          className="flex-1 p-2 mx-2 text-primary rounded-full border border-gray-300 bg-primary-foreground focus:outline-yellow-200 pl-4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.code === "Enter") {
              handleSend();
            }
          }}
        />
        <button onClick={handleSend} className="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 focus:outline-none">
          <Send size={20} />
        </button>
      </div>
    </>
  );
};
