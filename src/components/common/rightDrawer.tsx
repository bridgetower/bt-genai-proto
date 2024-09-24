import { X } from "lucide-react";
import React, { ReactNode } from "react";

import { Button } from "./button";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  width?: string; // Allows setting custom width
  children: ReactNode; // Content inside the side panel
}

const RightDrawer: React.FC<DrawerProps> = ({ isOpen, onClose, width = "w-1/3", children }) => {
  return (
    <div className="relative">
      {/* Side Panel */}
      <div
        className={`z-50 fixed top-0 right-0 ${width} h-screen  bg-primary-foreground text-card-foreground shadow-lg transform transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 text-start">
          <Button onClick={() => onClose()} className="rounded-full h-8 w-8" variant={"ghost"} size={"icon"}>
            <X size={20} />
          </Button>
          <hr className="my-4" />
        </div>

        <div className="overflow-auto h-screen custom-scrollbar pb-36">{children}</div>
      </div>

      {/* Overlay (optional) */}
      {isOpen && <div onClick={onClose} className="fixed inset-[10px] z-40"></div>}
    </div>
  );
};

export default RightDrawer;
