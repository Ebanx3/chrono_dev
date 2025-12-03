import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./components/pages/Home/Home";
import { MainLayout } from "./components/Layout/MainLayout";
import { Projects } from "./components/pages/Projects/Projects";
import { Posts } from "./components/pages/Posts/Posts";
import { Login } from "./components/pages/Login/Login";
import { Register } from "./components/pages/Register/Register";
import { UserContextProvider } from "./contexts/UserContextProvider";
import { FormsPagesLayout } from "./components/Layout/FormsPagesLayout";
import { Toaster } from "sonner";
import { Users } from "./components/pages/Users/Users";
import { Project } from "./components/pages/Project/Project";
import { Post } from "./components/pages/Post/Post";
import { User } from "./components/pages/User/User";

export const App = () => {
  return (
    <BrowserRouter>
      <Toaster richColors/>
      <UserContextProvider>

        <Routes>
          <Route element={<MainLayout />}>
            <Route path={"/"} element={<Home />} />
            <Route path={"/proyectos"} element={<Projects />} />
            <Route path={"/proyectos/usuario/:userId"} element={<Project />} />
            <Route path={"/publicaciones"} element={<Posts />} />
            <Route path={"/publicaciones/usuario/:userId"} element={<Post />} />
            <Route path={"/usuarios"} element={<Users />} />
            <Route path={"/usuario/:userId"} element={<User />} />
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
