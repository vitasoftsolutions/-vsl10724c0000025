import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { PettyCash } from "../pages/Dashboard/PettyCash/PettyCash";
import Login from "../pages/Login/Login";
import Pos from "../Pos";
import { routeGenerator } from "../utilities/lib/routesGenerator";
import { adminPaths } from "./admin.routes";
import PrivateRoute from "./PrivateRoute";
import PosRoute from "./PosRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <App />
      </PrivateRoute>
    ),
    children: [
      ...routeGenerator(adminPaths),
      {
        path: "petty-cash",
        element: <PettyCash />,
      },
    ],
  },
  {
    path: "/pos",
    element: (
      <PosRoute>
        <Pos />
      </PosRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
