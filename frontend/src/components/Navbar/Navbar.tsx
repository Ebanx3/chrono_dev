import { NavLink } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="flex py-2 px-4 justify-end gap-4">
      <NavLink
        to={"/"}
        className={({ isActive }) =>
          isActive ? "text-stone-400 cursor-default" : "hover:text-stone-600"
        }
      >
        Inicio
      </NavLink>
      <NavLink
        to={"/proyectos"}
        className={({ isActive }) =>
          isActive ? "text-stone-400 cursor-default" : "hover:text-stone-600"
        }
      >
        Proyectos
      </NavLink>
      <NavLink
        to={"/publicaciones"}
        className={({ isActive }) =>
          isActive ? "text-stone-400 cursor-default" : "hover:text-stone-600"
        }
      >
        Publicaciones
      </NavLink>
    </nav>
  );
};
