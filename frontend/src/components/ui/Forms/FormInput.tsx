import { useState } from "react";
import { ShowPasswordButton } from "./ShowPasswordButton";
import { HelpIcon } from "../HelpIcon";

interface InputProps {
  name: string;
  type: "text" | "password" | "email";
  label: string;
  placeholder: string;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  helpIconContent?:string;
}

export const FormInput = ({
  name,
  type,
  label,
  placeholder,
  inputValue,
  helpIconContent,
  setInputValue,
}: InputProps) => {
  const [isPassVisible, setIsPassVisible] = useState(false);

  if (type === "password") {
    return (
      <div className="relative mb-4 flex flex-col">
        <>
          <label htmlFor={name} className="text-slate-300 font-medium text-sm ">
            {label}
          </label>
          <input
            type={isPassVisible ? "text" : "password"}
            id={name}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="border border-slate-700 rounded-md focus:ring-2 focus:ring-slate-400 focus:border-slate-400 p-2 transition focus:outline-none"
            placeholder={placeholder}
          />
        </>
        <ShowPasswordButton
          isPassVisible={isPassVisible}
          setIsPassVisible={setIsPassVisible}
        />
      </div>
    );
  }

  return (
    <>
      <label htmlFor={name} className="text-slate-400 font-medium text-sm flex gap-2">
        {label}
        {helpIconContent && <HelpIcon content={helpIconContent} />}
      </label>
      <input
        type={type}
        id={name}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="border border-slate-700 rounded-md focus:ring-2 focus:ring-slate-400 focus:border-slate-400 p-2 transition mb-4 focus:outline-none text-slate-300"
        placeholder={placeholder}
      />
    </>
  );
};
