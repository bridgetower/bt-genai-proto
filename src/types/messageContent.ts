export interface IMessageContent {
  message: string;
  session_id: string;
  isBot: boolean;
  timestamp: string;
  source_text: string[];
  source_filenamelist: string[];
  question: string;
  job_id: string;
  sourceReference: SourceReference[];
}

export interface SourceReference {
  refType: "website" | "document";
  content: string;
  id: number;
}
