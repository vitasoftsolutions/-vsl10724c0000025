import dayjs from "dayjs";

export const sanitizeObj = (values) => {
  const sanitizedValues = {};
  Object.keys(values).forEach((key) => {
    if (
      values[key] &&
      typeof values[key] === "string" &&
      values[key].trim() !== ""
    ) {
      sanitizedValues[key] = values[key].trim();
    } else if (values[key] && typeof values[key] !== "string") {
      sanitizedValues[key] = values[key];
    }
    if (key?.includes("date") && values[key]) {
      sanitizedValues[key] = dayjs(values[key]).format("YYYY-MM-DD");
    }
  });

  return sanitizedValues;
};
