import { Form } from "antd";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useCurrentUser } from "../../redux/services/auth/authSlice";
import { useGetAllCashierQuery } from "../../redux/services/cashier/cashierApi";
import {
  DEFAULT_SELECT_VALUES,
  useGlobalParams,
} from "../../utilities/hooks/useParams";
import CustomSelect from "../Shared/Select/CustomSelect";

export const CashierComponent = ({
  required = true,
  name = "cashier_id",
  label = true,
  size,
}) => {
  const form = Form.useFormInstance();

  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });

  const { data, isLoading } = useGetAllCashierQuery({ params });

  const options = data?.results?.cashier?.map((cashier) => ({
    value: cashier?.id?.toString(),
    label: cashier?.name,
  }));

  const user = useSelector(useCurrentUser);

  useEffect(() => {
    if (options?.length && !form.getFieldValue(name)) {
      form.setFieldValue(name, user?.cashier_id?.toString());
    }
  }, [form, name, options, user?.cashier_id]);

  return (
    <CustomSelect
      label={label && "Cashier"}
      placeholder={"Cashier"}
      options={options}
      isLoading={isLoading}
      name={name}
      required={required}
      customStyle={!label}
      size={size}
    />
  );
};
