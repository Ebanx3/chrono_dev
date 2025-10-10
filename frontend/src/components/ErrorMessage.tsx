import { useEffect } from "react";

interface Props {
  message: string;
  setMessage: (s: string) => void;
}

export const ErrorMessage = ({ message, setMessage }: Props) => {
  useEffect(() => {
    setTimeout(() => {
      setMessage("");
    }, 3000);
  });
  return <span className="absolute bg-red-700 p-6 text-white text-sm font-medium whitespace-pre-line">{message}</span>;
}
