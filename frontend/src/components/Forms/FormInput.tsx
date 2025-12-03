import { useState } from "react";
import { ShowPasswordButton } from "./ShowPasswordButton";

interface InputProps {
  name: string;
  type: "text" | "password" | "email";
  label: string;
  placeholder: string;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
}

export const FormInput = ({
  name,
  type,
  label,
  placeholder,
  inputValue,
  setInputValue,
}: InputProps) => {
  const [isPassVisible, setIsPassVisible] = useState(false);

  if (type === "password") {
    return (
      <div className="relative mb-4 flex flex-col">
        <>
          <label htmlFor={name} className="text-stone-500 font-medium text-sm ">
            {label}
          </label>
          <input
            type={isPassVisible ? "text" : "password"}
            id={name}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="border border-stone-300 rounded-md focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 p-2 transition focus:outline-none"
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
      <label htmlFor={name} className="text-stone-500 font-medium text-sm">
        {label}
      </label>
      <input
        type={type}
        id={name}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="border border-stone-300 rounded-md focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 p-2 transition mb-4 focus:outline-none"
        placeholder={placeholder}
      />
    </>
  );
};
