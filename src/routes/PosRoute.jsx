import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  logout,
  useCurrentToken,
  useCurrentUser,
} from "../redux/services/auth/authSlice";
import { useCheckPettyCashQuery } from "../redux/services/pettycash/pettyCashApi";
import { useEffect } from "react";
import { setPettyCash } from "../redux/services/pettycash/pettyCashSlice";

function PosRoute({ children }) {
  const token = useSelector(useCurrentToken);
  const dispatch = useDispatch();

  const { pettyCash } = useSelector((state) => state.pettyCash);

  const user = useSelector(useCurrentUser);
  const warehouseId = user?.warehouse_id;

  const { data: pettyCashData } = useCheckPettyCashQuery(
    {
      params: {
        warehouse_id: parseInt(warehouseId),
      },
    },
    {
      skip: !warehouseId,
    }
  );

  // const { pettyCash } = useSelector((state) => state.pettyCash);

  useEffect(() => {
    if (pettyCashData?.data) {
      dispatch(setPettyCash(pettyCashData?.data));
    }
  }, [pettyCashData?.data, dispatch]);

  // console.log(pettyCash);

  // if (pettyCash === "Close") {
  //   return <Navigate to={"/dashboard"} replace={true} />;
  // }

  if (!token) {
    dispatch(logout());
    return <Navigate to={"/login"} replace={true} />;
  }

  return children;
}

export default PosRoute;
