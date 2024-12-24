import React, { createContext, useContext } from "react";

// Define the types for the context
interface ProjectIDContectType {
  projectId: string | null;
  setProjectId: React.Dispatch<React.SetStateAction<string | null>>;
}

// Create the context with a default value
export const ProjectIdContext = createContext<ProjectIDContectType | undefined>(undefined);

// Create a custom hook to use the ProjectIdContext
export const useProjectId = (): ProjectIDContectType => {
  const context = useContext(ProjectIdContext);
  if (!context) {
    throw new Error("useProjectId must be used within a ProjectidProvider");
  }
  return context;
};
