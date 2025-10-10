import { useContext } from "react";
import { userContext } from "../contexts/UserContext";

export const useUSerContext = () => useContext(userContext);