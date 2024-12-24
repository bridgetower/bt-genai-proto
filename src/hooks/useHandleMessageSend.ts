import { gql, useMutation } from "@apollo/client";
import { toast } from "react-hot-toast";

import { useAuth } from "@/providers/CoginitoAuthProvider";
import { useChat } from "@/store/chatStore";
import { SourceReference } from "@/types";

// GraphQL Mutation
const GENERATE_QUERY_ANSWER = gql`
  mutation GenerateQueryAnswer($message: String!, $projectId: String!, $sessionId: String) {
    GenerateQueryAnswer(input: { message: $message, projectId: $projectId, sessionId: $sessionId }) {
      job_id
      message
      sessionId
      source_text
      source_filenamelist
    }
  }
`;

export const useHandleMessageSend = (message: string, setMessage: React.Dispatch<React.SetStateAction<string>>) => {
  const { usersession } = useAuth();
  const { latestSessionId, setIsWaitingForResponse, setLatestSessionId, setChatContent } = useChat();

  const [generateQueryAnswer] = useMutation(GENERATE_QUERY_ANSWER);

  const submit = async () => {
    if (message.trim() === "") return;
    const token = localStorage.getItem("idToken") || "";
    const projectId = localStorage.getItem("projectId") || "";
    setIsWaitingForResponse(true);
    setChatContent((prev: any) => [
      ...prev,
      {
        message,
        question: message,
        isBot: false,
        timestamp: Date.now(),
        source_text: []
      }
    ]);

    try {
      setMessage("");
      const { data } = await generateQueryAnswer({
        variables: {
          message,
          projectId,
          sessionId: latestSessionId
        },
        context: {
          headers: {
            identity: token
          }
        }
      });

      if (data && data.GenerateQueryAnswer) {
        const response = data.GenerateQueryAnswer;
        console.log(response);

        if (response.sessionId) {
          setLatestSessionId(response.sessionId);
        }

        const refList = processSourceReferences(response.source_filenamelist || []);
        setChatContent((prev) => [
          ...prev,
          {
            ...response,
            isBot: true,
            timestamp: Date.now(),
            question: message,
            sourceReference: refList
          }
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsWaitingForResponse(false);
      setMessage(""); // Clear the input after sending
    }
  };

  return submit;
};

function processSourceReferences(sources: string[]): SourceReference[] {
  return sources
    .filter((source) => source.trim() !== "") // Remove empty or whitespace-only strings
    .map((source, index) => {
      try {
        JSON.parse(source);
        return {
          refType: "document",
          content: source,
          id: index
        };
      } catch {
        return {
          refType: "website",
          content: source,
          id: index
        };
      }
    });
}
