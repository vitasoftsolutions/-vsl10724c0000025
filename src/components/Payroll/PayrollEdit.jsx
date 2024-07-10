import { Form } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeEditDrawer } from "../../redux/services/drawer/drawerSlice";
import {
  useGetPayrollDetailsQuery,
  useUpdatePayrollMutation,
} from "../../redux/services/hrm/payroll/payrollApi";
import { appendToFormData } from "../../utilities/lib/appendFormData";
import { errorFieldsUpdate } from "../../utilities/lib/errorFieldsUpdate";
import {
  fieldsToUpdate,
  updateFieldValues,
} from "../../utilities/lib/fieldsToUpdate";
import { sanitizeObj } from "../../utilities/lib/sanitizeObj";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import { PayrollForm } from "./PayrollForm";

export const PayrollEdit = ({ id, setId }) => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [fields, setFields] = useState([]);

  const { isEditDrawerOpen } = useSelector((state) => state.drawer);

  const { data, isFetching } = useGetPayrollDetailsQuery({ id }, { skip: !id });

  // //console.log(isEditDrawerOpen, id);

  const [updatePayroll, { isLoading }] = useUpdatePayrollMutation();

  useEffect(() => {
    if (data) {
      const fieldData = fieldsToUpdate(data);

      const udpateFieldData = [
        {
          name: "is_send_email",
          value: data?.is_send_email.toString() === "1" ? true : false,
          errors: "",
        },
      ];

      const newFieldData = updateFieldValues(fieldData, udpateFieldData);

      setFields(newFieldData);
    }
  }, [data, setFields]);

  const handleUpdate = async (values) => {
    const formData = new FormData();

    const postData = {
      ...sanitizeObj(values),
      is_send_email: values?.is_send_email == true ? 1 : 0,
      bonus: Number(values?.bonus).toFixed(2),
      loan: Number(values?.loan).toFixed(2),
      salary: Number(values?.salary).toFixed(2),
      _method: "PUT",
    };

    appendToFormData(postData, formData);

    const { data, error } = await updatePayroll({
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
      title={"Edit Brand"}
      open={isEditDrawerOpen}
      isLoading={isFetching}
    >
      <PayrollForm
        handleSubmit={handleUpdate}
        isLoading={isLoading}
        fields={fields}
        form={form}
      />
    </CustomDrawer>
  );
};
