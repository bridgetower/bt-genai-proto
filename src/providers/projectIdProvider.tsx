import React, { ReactNode, useState } from "react";

import { ProjectIdContext } from "@/store/projectIdStore";

interface ChatProviderProps {
  children: ReactNode;
}

export const ProjectIdProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [projectId, setProjectId] = useState<string | null>(null);

  const value = {
    projectId,
    setProjectId
  };

  return <ProjectIdContext.Provider value={value}>{children}</ProjectIdContext.Provider>;
};
