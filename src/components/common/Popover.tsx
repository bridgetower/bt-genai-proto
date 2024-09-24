import React from "react";

import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";

type Props = {
  open: boolean;
  onClose: () => void;
  description: string;
};
export const Popover: React.FC<Props> = (props) => {
  const { open, description, onClose } = props;
  return (
    <Dialog open={open} onOpenChange={() => onClose()} modal>
      <DialogContent>
        <DialogHeader>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
