import { useState } from "react";
import toast from "react-hot-toast";

export const useCopyToClipboard = (): [(text: string) => Promise<void>, boolean] => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy.");
    }
  };

  return [copyToClipboard, copied];
};
