import axios from "axios";

import { useChat } from "@/store/chatStore";
import { SourceReference } from "@/types";

export const useHandleMessageSend = (message: string, setMessage: React.Dispatch<React.SetStateAction<string>>) => {
  const { latestSessionId, setIsWaitingForResponse, setLatestSessionId, setChatContent } = useChat();
  const submit = () => {
    if (message.trim() !== "") {
      setIsWaitingForResponse(true);
      setChatContent((pre: any) => [...pre, { message, question: message, isBot: false, timestamp: Date.now(), source_text: [] }]);
      axios
        .post(
          `https://e6hsickmqidhdhkjpclhol4eke0vovmg.lambda-url.us-east-1.on.aws/`,
          {
            // sessionId: latestSessionId,
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
            const refList = processSourceReferences(res.data.source_filenamelist);
            setChatContent((pre) => [
              ...pre,
              { ...res.data, isBot: true, timestamp: Date.now(), question: message, sourceReference: refList }
            ]);
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

function processSourceReferences(sources: string[]): SourceReference[] {
  return sources
    .filter((source) => source !== "") // Remove empty strings
    .map((source, index) => {
      try {
        // Try to parse as JSON to check if it's a document
        JSON.parse(source);
        return {
          refType: "document",
          content: source,
          id: index
        };
      } catch {
        // If JSON parsing fails, it's a website URL
        return {
          refType: "website",
          content: source,
          id: index
        };
      }
    });
}
