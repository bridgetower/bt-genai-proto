import axios from "axios";

import { useChat } from "@/store/chatStore";

export const useHandleMessageSend = (message: string, setMessage: React.Dispatch<React.SetStateAction<string>>) => {
  const { latestSessionId, setIsWaitingForResponse, setLatestSessionId, setChatContent } = useChat();
  const submit = () => {
    if (message.trim() !== "") {
      setIsWaitingForResponse(true);
      setChatContent((pre: any) => [...pre, { message, question: message, isBot: false, timestamp: Date.now(), source_text: [] }]);
      axios
        .post(
          `https://ine4p5pejlqlbcblnwodntx4qm0ytdwg.lambda-url.us-east-1.on.aws/`,
          {
            sessionId: latestSessionId,
            message: message
          },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
        .then((res) => {
          if (res.status === 200) {
            console.log(res.data);
            setLatestSessionId(res.data.sessionId);
            setChatContent((pre) => [...pre, { ...res.data, isBot: true, timestamp: Date.now(), question: message }]);
          }
        })
        .catch((e) => {
          console.log("Handle send msg", e);
        })
        .finally(() => {
          setIsWaitingForResponse(false);
        });

      setMessage(""); // Clear the input after sending
    }
  };

  return submit;
};
