export type Role = 'user' | 'assistant' | 'system';

export type MessageType = 'general' | 'summary' | 'tasks' | 'plan';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: string;
  type?: MessageType;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  tags?: string[];
}

export type Priority = 'high' | 'medium' | 'low';

export interface PlanStep {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  completed: boolean;
  estimatedTime?: string;
}

export interface StructuredPlan {
  id: string;
  goal: string;
  overview: string;
  steps: PlanStep[];
  createdAt: string;
}

export interface ExtractedTask {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
}

export type AppView = 'chat' | 'productivity' | 'history' | 'settings';

export interface AIProviderStatus {
  isDemoMode: boolean;
  hasApiKey: boolean;
  providerName: string;
}

