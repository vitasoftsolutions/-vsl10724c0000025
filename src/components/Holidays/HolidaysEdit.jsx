import { Form } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import { HolidaysForm } from "./HolidaysForm";
import {
  useGetHolidayDetailsQuery,
  useUpdateHolidayMutation,
} from "../../redux/services/hrm/holiday/holidayApi";
import { fieldsToUpdate } from "../../utilities/lib/fieldsToUpdate";
import dayjs from "dayjs";
import { appendToFormData } from "../../utilities/lib/appendFormData";
import { closeEditDrawer } from "../../redux/services/drawer/drawerSlice";
import { errorFieldsUpdate } from "../../utilities/lib/errorFieldsUpdate";

export const HolidaysEdit = ({ id, setId }) => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [fields, setFields] = useState([]);

  const { isEditDrawerOpen } = useSelector((state) => state.drawer);

  const { data, isFetching } = useGetHolidayDetailsQuery({ id }, { skip: !id });

  // //console.log(isEditDrawerOpen, id);

  const [updateHoliday, { isLoading }] = useUpdateHolidayMutation();

  useEffect(() => {
    if (data) {
      const fieldData = fieldsToUpdate(data);
      // const fieldData = [
      //   {
      //     name: "name",
      //     value: data?.name,
      //     errors: "",
      //   },
      // ];

      setFields(fieldData);
    }
  }, [data, setFields]);

  const handleUpdate = async (values) => {
    const formData = new FormData();

    const postObj = {
      ...values,
      department_ids: JSON.stringify(values?.department_ids),
      _method: "PUT",
    };

    if (values?.end_date) {
      postObj.end_date = values?.end_date;
    } else {
      postObj.end_date = dayjs(values?.end_date).format("YYYY-MM-DD");
    }

    appendToFormData(postObj, formData);

    const { data, error } = await updateHoliday({
      id,
      data: formData,
    });

    if (data?.success) {
      setId(undefined);
      dispatch(closeEditDrawer());
    }

    if (error) {
      const errorFields = errorFieldsUpdate(fields, error);

      setFields(errorFields);
    }
  };

  return (
    <CustomDrawer
      title={"Edit Holiday"}
      open={isEditDrawerOpen}
      isLoading={isFetching}
    >
      <HolidaysForm
        handleSubmit={handleUpdate}
        isLoading={isLoading}
        fields={fields}
        form={form}
      />
    </CustomDrawer>
  );
};
