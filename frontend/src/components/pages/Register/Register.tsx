import { useEffect, useState } from "react";
import { Form } from "../../Forms/Form";
import { FormInput } from "../../Forms/FormInput";
import { LoaderSVG } from "../../../assets/LoaderSVG";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../../../hooks/useUserContext";
import { validateRegisterFields } from "./ValidateRrgisterFields";
import { toast } from "sonner";
import { register } from "../../../api/authentication";
import { FormButton } from "../../Forms/FormButton";

export const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const nav = useNavigate();
  const { user } = useUserContext();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validatedData = await validateRegisterFields({
      username,
      email,
      password,
      confirmPassword
    });
    if (typeof validatedData === "string") {
      toast.error(validatedData, { style: { whiteSpace: "pre-line" } });
      return;
    }

    setIsLoading(true);
    const result = await register(validatedData);
    setIsLoading(false);
    if (!result.success) {
      toast.error(result.message);
      return;
    } else {
      toast.success("Registro exitoso. Ya puedes iniciar sesión.");
      nav("/login");
    }
  };

  useEffect(() => {
    if (user != null) {
      nav("/");
    }
  }, [user, nav]);

  return (
    <>
      <title>Registro</title>
      <Form handleSubmit={handleSubmit}>
        <FormInput
          name="username"
          type="text"
          label="Nombre de usuario"
          inputValue={username}
          setInputValue={setUsername}
          placeholder="Zeus"
        />
        <FormInput
          name="email"
          type="email"
          label="Correo electrónico"
          inputValue={email}
          setInputValue={setEmail}
          placeholder="zeus@example.com"
        />
        <FormInput
          name="password"
          type="password"
          label="Contraseña"
          inputValue={password}
          setInputValue={setPassword}
          placeholder="********"
        />
        <FormInput
          name="confirmPassword"
          type="password"
          label="Repetir contraseña"
          inputValue={confirmPassword}
          setInputValue={setConfirmPassword}
          placeholder="********"
        />

        {isLoading ? (
          <div className="self-center h-10">
            <LoaderSVG />
          </div>
        ) : (
          <FormButton label="Registrarse" />
        )}

        <span className="text-sm text-right mt-3 text-stone-500">
          ¿Ya tienes una cuenta? <br />
          <Link
            to={isLoading ? "#" : "/login"}
            className="text-emerald-700 font-bold hover:text-emerald-500"
          >
            Iniciar sesión
          </Link>
        </span>
      </Form>
    </>
  );
};
