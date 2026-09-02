import { NavLink } from "react-router-dom";

export const NavBarLink = ({to}:{to?:string}) => {
    return <NavLink
        to={`/${to?.toLowerCase() || ""}`}
        className={({ isActive }) =>
          isActive ? "text-slate-600 cursor-default"  : "text-slate-100 hover:text-slate-400"
        }
      >
        {to || "Inicio"}
      </NavLink>
}