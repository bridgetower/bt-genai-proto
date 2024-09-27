import React from "react";

const TextLoader: React.FC<{ text?: string }> = ({ text = "Loading" }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-lg font-normal">{text}</span>
      <div className="flex space-x-1">
        <span className="dot animate-bounce">.</span>
        <span className="dot animate-bounce animation-delay-200">.</span>
        <span className="dot animate-bounce animation-delay-400">.</span>
      </div>
    </div>
  );
};

export default TextLoader;
