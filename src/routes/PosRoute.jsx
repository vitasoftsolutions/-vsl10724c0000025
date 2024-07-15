import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { logout, useCurrentToken } from "../redux/services/auth/authSlice";

function PosRoute({ children }) {
  const token = useSelector(useCurrentToken);
  const dispatch = useDispatch();

  const { pettyCash } = useSelector((state) => state.pettyCash);

  if (pettyCash === "Close") {
    return <Navigate to={"/dashboard"} replace={true} />;
  }

  if (!token) {
    dispatch(logout());
    return <Navigate to={"/login"} replace={true} />;
  }

  return children;
}

export default PosRoute;
