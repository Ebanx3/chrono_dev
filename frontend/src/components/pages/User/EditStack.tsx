import { useState } from "react";
import { FormInput } from "../../Forms/FormInput";

export const EditStack = ({
  stack,
  setStack,
}: {
  stack: string[];
  setStack: React.Dispatch<React.SetStateAction<string[]>>;
}) => {

  return (
    <FormInput 
      label="Stack"
      name="stack"
      type="text"
      placeholder="Ingresa tu stack separado por comas"
      inputValue={stackInput}
      setInputValue={setStackInput}
    />
  );
};
