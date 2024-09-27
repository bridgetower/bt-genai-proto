import React from "react";

type LoaderWrapperProps = {
  show: boolean;
};

export const Loader: React.FC<LoaderWrapperProps> = ({ show }) => {
  return (
    <>
      {show ? (
        <div className="fixed inset-0 flex items-center justify-center bg-white/30 z-50">
          <div className="relative flex items-center justify-center w-64 h-64">
            <img src="/logo512.png" alt="Loading" className="w-16 h-w-16 rounded-full animate-zoom" />
            {/* Rotating Circle */}
            <div className="absolute border-t-4 border-amber-500 border-solid rounded-full w-20 h-20 animate-spin"></div>
          </div>
        </div>
      ) : null}
    </>
  );
};
