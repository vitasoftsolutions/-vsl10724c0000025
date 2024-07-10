/* eslint-disable no-unused-vars */
import { notification } from "antd";
import { Toaster } from "react-hot-toast";
import PosLayout from "./layout/PosLayout";

function Pos() {
  const [api, contextHolder] = notification.useNotification();

  return (
    <>
      {contextHolder}
      <Toaster position="top-right" reverseOrder={false} />
      <PosLayout />
    </>
  );
}

export default Pos;
