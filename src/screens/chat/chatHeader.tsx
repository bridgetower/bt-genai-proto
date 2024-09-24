import { on } from "events";
import { BookmarkPlusIcon, ClockAlert, CopyIcon, ForwardIcon, PlusCircle, Sun } from "lucide-react";
import React from "react";

import { Button } from "@/components/common/button";
import ThemeToggle from "@/components/common/themeToggler";
import { useChat } from "@/store/chatStore";

export const ChatHeader: React.FC = () => {
  const { setChatContent, setLatestSessionId, setSessionIds } = useChat();

  const onNewchat = () => {
    const newSessionid = "initial-" + Math.random().toString(36).substring(2, 11);
    setSessionIds((sessionIds) => [...sessionIds, newSessionid]);
    setLatestSessionId(newSessionid);
    setChatContent([]);
  };
  return (
    <div className="p-4 shadow-md bg-headerbackground">
      <div className="grid grid-cols-2 gap-1">
        <div className="flex justify-start items-center">
          <Button className="rounded-xl flex justify-between" variant={"outline"} onClick={() => onNewchat()}>
            <PlusCircle size={16} className="mr-1 text-orange-500" />
            New chat
          </Button>
          <Button variant={"outline"} size={"icon"} className="ml-3 hover:bg-none rounded-full h-8 w-8">
            <ClockAlert size={16} className="text-primary" />
          </Button>
        </div>
        <div className="flex justify-end items-center">
          {/* <Sun className="text-primary cursor-pointer" /> */}
          <ThemeToggle />
          <Button variant={"outline"} size={"icon"} className="ml-3 hover:bg-none h-8 w-8">
            <BookmarkPlusIcon size={20} className="text-primary" />
          </Button>
          <Button variant={"outline"} size={"icon"} className="ml-3 hover:bg-none h-8 w-8">
            <CopyIcon size={20} className="text-primary" />
          </Button>
          <Button variant={"outline"} size={"icon"} className="ml-3 hover:bg-none h-8 w-8">
            <ForwardIcon size={20} className="text-primary" />
          </Button>
        </div>
      </div>
    </div>
  );
};
