import { Form } from "antd";
import { useGetWarehousesQuery } from "../../redux/services/warehouse/warehouseApi";
import {
  DEFAULT_SELECT_VALUES,
  useGlobalParams,
} from "../../utilities/hooks/useParams";
import CustomSelect from "../Shared/Select/CustomSelect";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useCurrentUser } from "../../redux/services/auth/authSlice";

export const WarehouseComponent = ({
  name = "warehouse_id",
  label = true,
  title = "Warehouse",
  placeholder = "Warehouse",
  size,
}) => {
  const form = Form.useFormInstance();
  const user = useSelector(useCurrentUser);

  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });

  const { data, isLoading } = useGetWarehousesQuery({ params });

  const options = data?.results?.warehouse?.map((warehouse) => ({
    value: warehouse?.id?.toString(),
    label: warehouse?.name,
  }));

  useEffect(() => {
    if (options?.length && !form?.getFieldValue(name)) {
      form.setFieldValue(name, user?.warehouse_id?.toString());
    }
  }, [form, name, options, user?.warehouse_id]);

  return (
    <CustomSelect
      label={label && title}
      showSearch={true}
      isLoading={isLoading}
      options={options}
      placeholder={placeholder}
      name={name}
      required={true}
      customStyle={!label}
      size={size}
    />
  );
};
