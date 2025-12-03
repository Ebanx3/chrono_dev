import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateLoginFields } from "./ValidateLoginFields";
import { LoaderSVG } from "../../../assets/LoaderSVG";
import { login } from "../../../api/authentication";
import { useUserContext } from "../../../hooks/useUserContext";
import { toast } from "sonner";
import { Form } from "../../../components/Forms/Form";
import { FormInput } from "../../Forms/FormInput";
import { FormButton } from "../../Forms/FormButton";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const nav = useNavigate();
  const { user, setUser } = useUserContext();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validatedData = await validateLoginFields({ username, password });
    if (typeof validatedData === "string") {
      toast.error(validatedData, { style: { whiteSpace: "pre-line" } });
      return;
    }

    setIsLoading(true);
    const result = await login(validatedData);
    setIsLoading(false);
    if (!result.success) {
      toast.error(result.message);
      return;
    } else {
      setUser(result.data!);
      nav(-1);
    }
  };

  useEffect(() => {
    if (user != null) {
      nav("/");
    }
  }, [user, nav]);

  return (
    <>
      <title>Ingresar</title>

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
          name="password"
          type="password"
          label="Contraseña"
          inputValue={password}
          setInputValue={setPassword}
          placeholder="********"
        />

        {isLoading ? (
          <div className="self-center h-10">
            <LoaderSVG />
          </div>
        ) : (
          <FormButton label="Ingresar" />
        )}

        <span className="text-sm text-right mt-3 text-stone-500">
          ¿No tienes una cuenta? <br />
          <Link
            to={isLoading ? "#" : "/registro"}
            className="text-emerald-700 font-bold hover:text-emerald-500"
          >
            Crear cuenta
          </Link>
        </span>
      </Form>
    </>
  );
};
