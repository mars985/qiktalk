import type { User } from "./user";

type Message = {
    _id: string;
    body: string;
    sender: User;
};

export type { Message };
