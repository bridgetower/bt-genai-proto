import { ISteperData } from "@/components/common/Stepper";
// src/types.ts
export interface IProjectAttributes {
  id: string;
  name: string;
  description: string;
  projecttype: string;
  projectstatus: string;
  projectstage: ProjectStageEnum;
  organizationsd: number;
  createdby: string;
  createdat: Date;
  isactive: boolean;
  hashRecorded: any[];
  hasAlert?: boolean;
}
export interface IFileContent {
  refType: "DOCUMENT" | "WEBSITE";
  fileName?: string;
  contentType?: string;
  isLocal?: boolean;
  fileContent?: string;
  id?: string;
  fileSize?: string;
  hash?: string;
  depth?: number;
  websiteName?: string;
  websiteUrl?: string;
}
export enum ProjectType {
  "ON PREM" = "ON_PREM",
  HYBRID = "HYBRID",
  CLOUD = "CLOUD",
  "CUSTOM CLOUD" = "CUSTOM_CLOUD"
}

export enum ProjectStageEnum {
  DATA_SELECTION = "DATA_SELECTION",
  DATA_INGESTION = "DATA_INGESTION",
  DATA_STORAGE = "DATA_STORAGE",
  DATA_PREPARATION = "DATA_PREPARATION",
  LLM_FINE_TUNING = "LLM_FINE_TUNING",
  // VERSIONING = 'VERSIONING',
  // RAG = 'RAG',
  PUBLISHED = "PUBLISHED"
}

export const getProjectStageEnumValue = (key: string): string => {
  return ProjectStageEnum[key as keyof typeof ProjectStageEnum];
};
export const ProjectStageLabel = {
  DATA_SELECTION: "Data Source",
  DATA_INGESTION: "Data Ingestion",
  DATA_STORAGE: "Data Storage",
  DATA_PREPARATION: "Data Preparation",
  LLM_FINE_TUNING: "RAG Ingestion",
  // VERSIONING: 'Versioning',
  // RAG: 'RAG',
  PUBLISHED: "Published"
};

export enum ProjectStatusEnum {
  STARTED = "STARTED",
  PAUSED = "PAUSED",
  CANCELLED = "CANCELLED",
  ACTIVE = "ACTIVE"
}
export type ActionStatus = "INITIATED" | "ACTIVE" | "ERROR" | "CANCELLED" | "COMPLETED" | "PENDING" | "APPROVED" | "REJECTED";

export const statusColor: Record<ActionStatus, { bg: string; text: string }> = {
  INITIATED: {
    bg: "bg-blue-100", // Tailwind background color
    text: "text-blue-600" // Tailwind text color
  },
  ACTIVE: {
    bg: "bg-purple-100",
    text: "text-purple-600"
  },
  ERROR: {
    bg: "bg-red-100",
    text: "text-red-600"
  },
  CANCELLED: {
    bg: "bg-orange-100",
    text: "text-orange-600"
  },
  COMPLETED: {
    bg: "bg-green-100",
    text: "text-green-600"
  },
  PENDING: {
    bg: "bg-orange-100",
    text: "text-orange-600"
  },
  APPROVED: {
    bg: "bg-green-100",
    text: "text-green-600"
  },
  REJECTED: {
    bg: "bg-red-100",
    text: "text-red-600"
  }
};

export const ProjectStatusKeyValueArray: { key: string; value: string }[] = Object.entries(ProjectStatusEnum).map(([key, value]) => ({
  key: key.replace("_", " "),
  value
}));

// export const projectColors = [
//   "red",
//   "yellow",
//   "green",
//   "blue",
//   "indigo",
//   "purple",
//   "pink"

// ];
export const stepData: ISteperData[] = [
  {
    completed: true,

    label: ProjectStageLabel.DATA_SELECTION,
    data: null,
    dataLoading: false,
    isExpanded: true
  },
  {
    completed: false,

    label: ProjectStageLabel.DATA_INGESTION,
    data: null,
    dataLoading: false,
    isExpanded: false
  },
  {
    completed: false,

    label: ProjectStageLabel.DATA_STORAGE,
    data: null,
    dataLoading: false,
    isExpanded: false
  },
  {
    completed: false,

    label: ProjectStageLabel.DATA_PREPARATION,
    data: null,
    dataLoading: false,
    isExpanded: false
  },
  {
    completed: false,

    label: ProjectStageLabel.LLM_FINE_TUNING,
    data: null,
    dataLoading: false,
    isExpanded: false
  },
  {
    completed: false,

    label: ProjectStageLabel.PUBLISHED,
    data: null,
    dataLoading: false,
    isExpanded: false,
    isLast: true
  }
];
