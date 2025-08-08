import type { User } from "./user";

type Message = {
    id: string;
    body: string;
    sender: User;
    timestamp: Date;
};

export type { Message };
