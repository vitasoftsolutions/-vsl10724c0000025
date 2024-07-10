import dayjs from "dayjs";

export const getLastWeek = () => {
  const end = dayjs();
  const start = dayjs().subtract(6, "day");

  return [start, end];
};
