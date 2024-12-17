import React from "react";
import { TypeAnimation } from "react-type-animation";

import { Logo } from "./logo";

interface Props {
  children: React.ReactNode;
}

export const SignInBanner: React.FC<Props> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-3 h-screen">
      <div className="bg-gray-900 p-4 h-[50vh] md:h-auto">
        <Logo height={50} width={200} />
        <div className="h-full flex items-center px-8 md:px-24 -translate-y-10">
          <div className="flex flex-row items-center w-full">
            <div className="font-firaSans  text-white leading-none text-2xl md:text-5xl">
              <p className="py-2">YOUR WAY,</p>
              <TypeAnimation
                deletionSpeed={50}
                speed={20}
                style={{ whiteSpace: "pre-line", height: "55px", display: "block" }}
                sequence={[` OUR HIGHWAY`, 1000, ""]}
                repeat={Infinity}
              />
              <p className="text-lg leading-loose text-white">BridgeTower GenAI Solutions</p>
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};
