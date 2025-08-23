type User = {
  _id: string;
  username: string;
  avatarUrl: string | null;
};

type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export type { User, UserContextType };
