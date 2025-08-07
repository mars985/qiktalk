// user-context.tsx
import React, { createContext, useState } from "react";
import type { User, UserContextType } from "@/types/user";

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext }; // still exporting, but now this file is dedicated to context
