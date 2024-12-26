import { AlertTriangle } from "lucide-react";
import React from "react";

import { Dialog, DialogClose, DialogContent } from "../ui/dialog";

interface ErrorPopupProps {
  message: string;
  onClose: () => void;
  open: boolean;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ message, onClose, open }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card rounded-3xl sm:w-[400px] w-full">
        <DialogClose />
        <div className="flex justify-center">
          <AlertTriangle size={60} className="text-red-500 text-4xl" />
        </div>
        <div className="flex justify-center w-full">
          <p className="text-lg text-red-500  text-center">{message}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ErrorPopup;
