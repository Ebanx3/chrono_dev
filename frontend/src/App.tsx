import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./components/pages/Home/Home";
import { MainLayout } from "./components/Layout/MainLayout";
import { Projects } from "./components/pages/Projects/Projects";
import { Posts } from "./components/pages/Posts/Posts";
import { Login } from "./components/pages/Login/Login";
import { Register } from "./components/pages/Register/Register";
import { UserContextProvider } from "./contexts/UserContextProvider";
import { FormsPagesLayout } from "./components/Layout/FormsPagesLayout";

export const App = () => {
  return (
    <BrowserRouter>
      <UserContextProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path={"/"} element={<Home />} />
            <Route path={"/proyectos"} element={<Projects />} />
            <Route path={"/publicaciones"} element={<Posts />} />
          </Route>
          <Route element={<FormsPagesLayout />}>
            <Route path={"/login"} element={<Login />} />
            <Route path={"/registro"} element={<Register />} />
          </Route>
        </Routes>
      </UserContextProvider>
    </BrowserRouter>
  );
};
