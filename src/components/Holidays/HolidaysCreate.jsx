import { Form } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeCreateDrawer } from "../../redux/services/drawer/drawerSlice";
import { useCreateHolidayMutation } from "../../redux/services/hrm/holiday/holidayApi";
import { appendToFormData } from "../../utilities/lib/appendFormData";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import { HolidaysForm } from "./HolidaysForm";

export const HolidaysCreate = () => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [errorFields, setErrorFields] = useState([]);
  const { isCreateDrawerOpen } = useSelector((state) => state.drawer);

  const [createHoliday, { isLoading }] = useCreateHolidayMutation();

  const handleSubmit = async (values) => {
    const formData = new FormData();

    const postObj = {
      ...values,
      department_ids: JSON.stringify(values?.department_ids),
    };

    if (values?.end_date) {
      postObj.end_date = values?.end_date;
    } else {
      postObj.end_date = dayjs(values?.end_date).format("YYYY-MM-DD");
    }

    appendToFormData(postObj, formData);

    const { data, error } = await createHoliday({
      formData,
    });

    if (data?.success) {
      dispatch(closeCreateDrawer());
      form.resetFields();
    }
    if (error) {
      const errorFields = Object.keys(error?.data?.errors).map((fieldName) => ({
        name: fieldName,
        errors: error?.data?.errors[fieldName],
      }));
      setErrorFields(errorFields);
    }
  };

  return (
    <CustomDrawer title={"Create Holiday"} open={isCreateDrawerOpen}>
      <HolidaysForm
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        fields={errorFields}
        form={form}
      />
    </CustomDrawer>
  );
};
