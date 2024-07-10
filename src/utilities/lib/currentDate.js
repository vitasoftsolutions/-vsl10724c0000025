import dayjs from "dayjs";

export const getCurrentDate = dayjs(new Date());

// export const disabledDate = (current) => {
//   return current < dayjs().startOf("day");
// };

export const disabledDate = (current, startDate) => {
  if (startDate) {
    return current && startDate && current < dayjs(startDate).startOf("day");
  } else {
    return current < dayjs().startOf("day");
  }
};
