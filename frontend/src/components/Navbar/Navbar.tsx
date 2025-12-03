import { NavLink } from "react-router-dom";
import { useUserContext } from "../../hooks/useUserContext";
import { NavBarLink } from "./NavBarLink";
import { DropdownMenu } from "./DropdownMenu";

export const Navbar = () => {
  const { user } = useUserContext();

  return (
    <nav className="flex py-4 px-12 justify-end items-center gap-4">
      <NavBarLink />
      <NavBarLink to="Proyectos"/>
      <NavBarLink to="Publicaciones"/>
      <NavBarLink to="Usuarios"/>

      {user === null ? (
        <NavLink
          to={"/login"}
          className={
            "bg-emerald-600 py-2 text-white rounded-lg transition duration-300 hover:brightness-110 hover:scale-[1.03] w-24 text-center"
          }
        >
          Ingresar
        </NavLink>
      ) : (
        <DropdownMenu />
      )}
    </nav>
  );
};
