import { Outlet } from "react-router-dom";

export const FormsPagesLayout = () => {
  return (
    <main className="min-h-screen bg-stone-200 w-screen flex items-center justify-center">
      <Outlet />
    </main>
  );
};
