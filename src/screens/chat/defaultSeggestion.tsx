import React, { useEffect, useState } from "react";

import ErrorPopup from "@/components/errorAlert/ErrorPopup";
import { useHandleMessageSend } from "@/hooks/useHandleMessageSend";
import { useProjectId } from "@/store/projectIdStore";

// import Logo from "@/components/common/logo";
const defaultSuggestion = [
  {
    id: 1,
    text: "How does Abu Dhabi Global Market (ADGM) support sustainable finance initiatives?"
  },
  {
    id: 2,
    text: "What are the key regulatory requirements for setting up a business in ADGM?"
  },
  {
    id: 3,
    text: "How does ADGM ensure compliance with international financial standards?"
  }
];
export const DefaultSuggestions: React.FC = () => {
  // const projectId = localStorage.getItem("projectId") || "";
  const [message, setMessage] = useState("");
  const handleSend = useHandleMessageSend(message, setMessage);
  const { projectId } = useProjectId();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);
  const handleSelect = (msg: string) => {
    setMessage(msg);
  };
  useEffect(() => {
    if (message) {
      handleSend();
    }
  }, [message]);

  const onMessageSendTrigger = (message: string) => {
    if (!projectId) {
      setErrorMsg("Please select project first and then send");
      setShowErrorAlert(true);
      return;
    } else {
      setErrorMsg("");
      handleSelect(message);
    }
  };
  const hideAlert = () => {
    setShowErrorAlert(false);
  };
  return (
    <>
      <ErrorPopup message={errorMsg} open={showErrorAlert} onClose={hideAlert} />
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3 ">
        {/* <div className="lg:col-span-3 md:col-span-2 col-span-1 flex justify-center mb-5">
        <Logo height={48} width={150}/>
      </div> */}
        {defaultSuggestion.map((item, index) => (
          <div
            key={index}
            className="text-primary text-base border border-primary rounded-xl bg-card shadow-md w-full p-5 cursor-pointer min-w-[100px]"
            onClick={() => onMessageSendTrigger(item.text)}
          >
            {item.text}
          </div>
        ))}
      </div>
    </>
  );
};
