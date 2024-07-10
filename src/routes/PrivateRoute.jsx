import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { logout, useCurrentToken } from "../redux/services/auth/authSlice";

function PrivateRoute({ children }) {
  const token = useSelector(useCurrentToken);
  const dispatch = useDispatch();

  if (!token) {
    dispatch(logout());
    return <Navigate to={"/login"} replace={true} />;
  }

  return children;
}

export default PrivateRoute;
