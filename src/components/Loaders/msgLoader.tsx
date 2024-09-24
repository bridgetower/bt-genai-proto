import React from "react";

const MessageLoader: React.FC = () => {
  return (
    <div className="flex space-x-2">
      <div className="w-3 h-3 bg-slate-500 rounded-full animate-bounce delay-300"></div>
      <div className="w-3 h-3 bg-slate-400 rounded-full animate-bounce delay-200"></div>
      <div className="w-3 h-3 bg-slate-300 rounded-full animate-bounce delay-100"></div>
    </div>
  );
};

export default MessageLoader;
