import { openNotification } from "./notification";

export const transformResponse = (response) => {
  if (response?.success) {
    openNotification("success", response?.message);
    return response;
  }
};

export const transformErrorResponse = (response) => {
  if (response?.data?.success === false) {
    openNotification("error", response?.data?.message);
    return response;
  }
};
