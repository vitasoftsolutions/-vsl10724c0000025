import { notification } from "antd";

export const openNotification = (type, message) => {
  notification[type]({
    message: type === "success" ? "Success" : "Failed",
    description:
      message ?? "No Message is provided. Task Completed Successfully",
  });
};

// export const useNotification = ({ type = "success", message }) => {
//   const { notification } = App.useApp();

//   return openNotification(type, message, notification);
// };

// export const openNotification = (type, message, notification) => {
//   notification[type]({
//     message: type === "success" ? "Success" : "Failed",
//     description:
//       message ?? "No Message is provided. Task Completed Successfully",
//   });
// };
