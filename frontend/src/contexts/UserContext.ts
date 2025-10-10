import { createContext } from "react";

interface UserContext {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>
}

export const userContext = createContext<UserContext>({
  user: null,
  setUser: () => {},
});