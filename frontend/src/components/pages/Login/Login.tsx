import { useState } from "react";
import { Link } from "react-router-dom";
import { ErrorMessage } from "../../ErrorMessage";
import { validateLoginFields } from "./ValidateLoginFields";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const HandleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validatedData = await validateLoginFields({ username, password });
    if(typeof validatedData === 'string'){
      setErrorMessage(validatedData);
      return;
    }

    //crear metodo api
  
  };

  return (
    <>
      <title>Ingresar</title>

      <form className="p-4 shadow-sm shadow-stone-700 rouned-lg flex flex-col gap-1 bg-white" onSubmit={HandleSubmit}>

        <label htmlFor="username" className=" text-stone-600">Nombre de usuario:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-stone-300 focus:outline-none p-1 mb-4"
          placeholder="zeus..."
        />

        <label htmlFor="password" className=" text-stone-600">Contraseña: </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-stone-300 focus:outline-none p-1 mb-4"
          placeholder="********"
        />

        <button
          // type="button"
          className="bg-emerald-600 text-white font-medium py-1 transition duration-300 hover:brightness-110 hover:scale-[1.03] cursor-pointer"
        >
          Ingresar
        </button>

        <span className="text-sm text-right mt-2">
          ¿No tienes una cuenta? <br />
          <Link
            to={"/register"}
            className="text-emerald-700 font-bold hover:text-emerald-500"
          >
            Crear cuenta
          </Link>
        </span>

      </form>

      {errorMessage != "" && (
        <ErrorMessage message={errorMessage} setMessage={setErrorMessage} />
      )}
    </>
  );
};
