import type { User } from "./user";

type Message = {
    _id: string;
    body: string;
    sender: User;
    timestamp: Date;
};

export type { Message };
