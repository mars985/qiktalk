import type { User } from "./user";
import type { Message } from "./message";

type Conversation = {
  _id: string;
  type: ConversationType;
  participants: User[];
  messages: Message[];
  groupName: string | null;
  updatedAt: string | null;
}

type ConversationType = "dm" | "group";

export type { Conversation, ConversationType }