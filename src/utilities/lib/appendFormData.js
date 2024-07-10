import dayjs from "dayjs";

export const appendToFormData = (data, formData) => {
  const ignoreKeys = ["has_expired_date"];
  function append(key, value) {
    if (Array.isArray(value) && key.includes("attachments")) {
      value.forEach((item) => {
        formData.append(`${key}[]`, item);
      });
    } else if (Array.isArray(value)) {
      value.forEach((item) => {
        formData.append(key, item);
      });
    } else if (key.includes("date") && !ignoreKeys.includes(key)) {
      formData.append(key, dayjs(value).format("YYYY-MM-DD"));
    } else if (value) {
      formData.append(key, value);
    }
  }

  Object.entries(data).forEach(([key, value]) => {
    append(key, value);
  });
};
