import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { logout } from "../../api/authentication";
import { useUserContext } from "../../hooks/useUserContext";

export const DropdownMenu = () => {
  const [open, setOpen] = useState(false);
  const { user, setUser } = useUserContext();
  
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      {/* Botón */}
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex justify-center border border-stone-300 rounded-md px-4 py-2 bg-white text-sm font-medium text-stone-700 hover:bg-stone-50 focus:outline-none w-24 text-center"
      >
        {user!.username}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-stone-200 focus:outline-none z-10">
          <div className="py-1 flex flex-col">
            <Link
              to={`/usuarios/${user!._id}`}
              className="px-4 py-2 text-sm text-stone-700 hover:bg-stone-100 text-left"
            >
              Perfil
            </Link>
            <Link
              to={`/proyectos/usuario/${user!._id}`}
              className="px-4 py-2 text-sm text-stone-700 hover:bg-stone-100 text-left"
            >
              Mis proyectos
            </Link>
            <Link
              to={`/publicaciones/usuario/${user!._id}`}
              className="px-4 py-2 text-sm text-stone-700 hover:bg-stone-100 text-left"
            >
              Mis publicaciones
            </Link>
            <button
              className="px-4 py-2 text-sm text-red-600 hover:bg-red-100 text-left"
              onClick={handleLogout}
            >
              Salir
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
