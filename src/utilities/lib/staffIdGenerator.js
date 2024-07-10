import dayjs from "dayjs";

export const staffIdGenerator = (company_code, joinDate, staff_id = "") => {
  const month = joinDate ? dayjs(joinDate).format("MM") : "MM";
  const year = joinDate ? dayjs(joinDate).format("YY") : "YY";

  return company_code + "-" + month + year + "-" + staff_id ?? "";
};
