import { Outlet } from "react-router-dom";
import { Navbar } from "../Navbar/Navbar";
import { Footer } from "../Footer/footer";

export const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main className="max-w-[1160px] m-auto min-h-[calc(100vh-120px)] p-2 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
