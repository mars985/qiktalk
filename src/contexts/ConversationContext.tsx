import React, { createContext, useState } from "react";
import type { User, UserContextType } from "@/types/user";

const ConversationContext = createContext<UserContextType | undefined>(undefined);

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <ConversationContext.Provider value={{ user, setUser }}>
      {children}
    </ConversationContext.Provider>
  );
};

export { ConversationContext };
