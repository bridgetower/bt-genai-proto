import React from "react";

import ThemeToggle from "@/components/common/themeToggler";

export const CommonHeader: React.FC = () => {
  return (
    <div className="p-4 shadow-md bg-headerbackground">
      <div className="grid grid-cols-2 gap-1">
        <div className="flex justify-start items-center"></div>
        <div className="flex justify-end items-center">
          {/* <Sun className="text-primary cursor-pointer" /> */}
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};
