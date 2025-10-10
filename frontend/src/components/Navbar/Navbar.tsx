import { NavLink } from "react-router-dom";
import { useUSerContext } from "../../hooks/useUserContext";

export const Navbar = () => {
  const { user } = useUSerContext();

  return (
    <nav className="flex py-2 px-4 justify-end items-center gap-4">
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
      {user === null ? (
        <NavLink
          to={"/login"}
          className={({ isActive }) =>
            isActive
              ? "bg-gradient-to-b from-gray-400 to-gray-500 py-2 px-4 text-white rounded-lg cursor-default"
              : "bg-emerald-600 py-2 px-4 text-white rounded-lg transition duration-300 hover:brightness-110 hover:scale-[1.03]"
          }
        >
          Ingresar
        </NavLink>
      ) : (
        <button>{user.username}</button>
      )}
    </nav>
  );
};
