import { ArrowLeft, X } from "lucide-react";
import React, { ReactNode } from "react";

import { Button } from "./button";

interface DrawerProps {
  title: string; // Title of the side panel
  isOpen: boolean;
  onClose: (type: "origin" | "sources" | "") => void;
  children: ReactNode; // Content inside the side panel
  width?: string; // Allows setting custom width
}

const RightDrawer: React.FC<DrawerProps> = ({ isOpen, onClose, width = "w-2/5", children, title }) => {
  return (
    <div className="relative">
      {/* Side Panel */}
      <div
        className={`z-50 fixed top-0 right-0 ${width} h-screen rounded-tl-2xl bg-primary-foreground text-card-foreground shadow-lg transform transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="px-4 pt-4 flex justify-between items-center">
          <div className="w-6 mr-2">
            <Button onClick={() => onClose("")} className="rounded-full h-8 w-8" variant={"ghost"} size={"icon"}>
              <ArrowLeft size={20} className="text-primary" />
            </Button>
          </div>
          <h1 className="text-xl text-primary font-bold w-full">{title}</h1>
          <div className="w-6">
            <Button onClick={() => onClose("")} className="rounded-full h-8 w-8" variant={"ghost"} size={"icon"}>
              <X size={20} className="text-primary" />
            </Button>
          </div>
        </div>
        <hr className="my-4" />

        <div className="overflow-auto h-screen custom-scrollbar pb-36">{children}</div>
      </div>

      {/* Overlay (optional) */}
      {isOpen && <div onClick={() => onClose("")} className="fixed inset-[0px] z-40 bg-black/40"></div>}
    </div>
  );
};

export default RightDrawer;
