import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./components/pages/Home/Home";
import { Layout } from "./components/Layout/Layout";
import { Projects } from "./components/pages/Projects/Projects";
import { Posts } from "./components/pages/Posts/Posts";
import { Login } from "./components/pages/Login/Login";
import { Register } from "./components/pages/Register/Register";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path={"/"} element={<Home />} />
          <Route path={"/proyectos"} element={<Projects />} />
          <Route path={"/publicaciones"} element={<Posts />} />
        </Route>
        <Route path={"/login"} element={<Login />}/>
        <Route path={"/registro"} element={<Register />}/>
      </Routes>
    </BrowserRouter>
  );
};
