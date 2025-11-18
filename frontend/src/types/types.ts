export interface Message {
  sender: "user" | "ai";
  text: string;
}

export interface AssistantResponse {
  trigger: string;
  response: string;
  isActive: boolean;
  category?: string;
}

export interface ScheduleClass {
  subject: string;
  startTime: string;
  endTime: string;
  teacher?: string;
  room?: string;
  type: string;
}

export interface Schedule {
  dayOfWeek: string;
  date: string;
  classes: ScheduleClass[];
}

export interface Task {
  _id?: string;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: string;
  category: string;
  subject: string;
  estimatedTime: number;
}

export const API_BASE_URL = 'http://localhost:5000/api';