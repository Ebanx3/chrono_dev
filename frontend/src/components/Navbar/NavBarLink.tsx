import { NavLink } from "react-router-dom";

export const NavBarLink = ({to}:{to?:string}) => {
    return <NavLink
        to={`/${to?.toLowerCase() || ""}`}
        className={({ isActive }) =>
          isActive ? "text-stone-300 cursor-default"  : "hover:text-stone-500"
        }
      >
        {to || "Inicio"}
      </NavLink>
}