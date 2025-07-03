export interface YouTubeLiveChatMessage {
  id: string;
  authorDisplayName: string;
  displayMessage: string;
  publishedAt: string;
  profileImageUrl: string;
}

export interface StudySession {
  date: string; // YYYY-MM-DD format
  studyTime: number; // in seconds
  sessions: Array<{
    startTime: Date;
    endTime: Date;
    duration: number; // in seconds
  }>;
}

export interface StudyTimeUser {
  name: string;
  studyTime: number; // in seconds (total)
  profileImageUrl: string;
  startTime?: Date;
  isStudying: boolean;
  studySessions: StudySession[]; // daily study records
  hasVisitStamp: boolean; // for greeting stamp
  visitStamps: { [date: string]: boolean }; // daily visit stamps by date (YYYY-MM-DD)
}

export interface WeeklyStudyData {
  weekStart: string; // YYYY-MM-DD format (Monday)
  weekEnd: string;   // YYYY-MM-DD format (Sunday)
  users: Array<{
    name: string;
    profileImageUrl: string;
    totalStudyTime: number; // in seconds
    dailyStudyTime: Array<{
      date: string;
      studyTime: number;
    }>;
  }>;
}

export interface LiveChatResponse {
  messages: YouTubeLiveChatMessage[];
  nextPageToken?: string;
  pollingIntervalMillis: number;
}