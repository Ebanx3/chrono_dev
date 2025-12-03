import { Outlet } from "react-router-dom";

export const FormsPagesLayout = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-stone-100 via-stone-200 to-stone-300 w-screen flex items-center justify-center">
      <Outlet />
    </main>
  );
};
