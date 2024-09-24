export interface IMessageContent {
  message: string;
  session_id: string;
  isBot: boolean;
  timestamp: string;
  source_text: string[];
  question: string;
}
