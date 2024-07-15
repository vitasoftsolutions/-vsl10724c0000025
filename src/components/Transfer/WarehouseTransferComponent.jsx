import { Col, Form } from "antd";
import { largeLayout, mdColLayout } from "../../layout/FormLayout";
import { useGetWarehousesQuery } from "../../redux/services/warehouse/warehouseApi";
import {
  DEFAULT_SELECT_VALUES,
  useGlobalParams,
} from "../../utilities/hooks/useParams";
import { useInitialFormField } from "../../utilities/lib/updateFormValues/useInitialFormField";
import CustomSelect from "../Shared/Select/CustomSelect";

export const WarehouseTransferComponent = ({ fullLayout = false }) => {
  const form = Form.useFormInstance();

  const warehouseFrom = Form.useWatch("from_warehouse_id", form);

  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });

  const { data, isLoading } = useGetWarehousesQuery({ params });

  const warehouseFromOptions = data?.results?.warehouse?.map((warehouse) => ({
    value: warehouse.id?.toString(),
    label: warehouse.name,
  }));

  useInitialFormField("from_warehouse_id", warehouseFromOptions);

  const warehouseToOptions = data?.results?.warehouse?.map((warehouse) => ({
    value: warehouse.id?.toString(),
    label: warehouse.name,
    disabled: warehouse.id.toString() === warehouseFrom,
  }));

  return (
    <>
      <Col {...(fullLayout ? mdColLayout : largeLayout)}>
        <CustomSelect
          label="Warehouse (From)"
          placeholder={"Warehouse (From)"}
          showSearch={true}
          isLoading={isLoading}
          options={warehouseFromOptions}
          name="from_warehouse_id"
          required={true}
        />
      </Col>
      <Col {...(fullLayout ? mdColLayout : largeLayout)}>
        <CustomSelect
          label="Warehouse (To)"
          placeholder={"Warehouse (To)"}
          showSearch={true}
          isLoading={isLoading}
          options={warehouseToOptions}
          name="to_warehouse_id"
          required={true}
        />
      </Col>
    </>
  );
};
