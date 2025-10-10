import { useEffect, useState, type ReactNode } from "react";
import { userContext } from "./UserContext";

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const savedUser = JSON.parse(
    localStorage.getItem("chrono_dev_stored_user") || "null"
  );
  const [user, setUser] = useState<User | null>(savedUser);

  useEffect(() => {
    localStorage.setItem("chrono_dev_stored_user", JSON.stringify(user));
  }, [user]);
  
  return (
    <userContext.Provider value={{ user, setUser }}>
      {children}
    </userContext.Provider>
  );
};
