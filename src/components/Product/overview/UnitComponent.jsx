import { Col, Form } from "antd";
import { useGetAllUnitQuery } from "../../../redux/services/unit/unitApi";
import { colLayout } from "../../../layout/FormLayout";
import CustomSelect from "../../Shared/Select/CustomSelect";
import { useGlobalParams } from "../../../utilities/hooks/useParams";

const ProductUnit = ({ options = [], isLoading }) => {
  return (
    <Col {...colLayout}>
      <CustomSelect
        label="Product Unit"
        options={options}
        isLoading={isLoading}
        required={true}
        name={"unit_id"}
        showSearch={true}
      />
    </Col>
  );
};

const PurchaseUnit = ({ options = [], isLoading }) => {
  // const form = Form.useFormInstance();

  // const unit_id = Form.useWatch("unit_id", form);

  // console.log(unit_id);

  return (
    <Col {...colLayout}>
      <CustomSelect
        label="Puchase Unit"
        options={options}
        isLoading={isLoading}
        required={true}
        name={"purchase_unit_id"}
        showSearch={true}
      />
    </Col>
  );
};

const SaleUnit = ({ options = [], isLoading }) => {
  return (
    <Col {...colLayout}>
      <CustomSelect
        label="Sale Unit"
        options={options}
        isLoading={isLoading}
        required={true}
        name={"sale_unit_id"}
        showSearch={true}
      />
    </Col>
  );
};

const UnitComponent = () => {
  const form = Form.useFormInstance();
  const productType = Form.useWatch("type", form);

  const params = useGlobalParams({
    selectValue: ["name", "id", "for"],
  });

  const { data, isLoading } = useGetAllUnitQuery({
    params,
  });

  const productUnits = data?.results?.unit
    ?.filter((unit) => unit.for === "product-unit")
    .map((unit) => ({ value: unit.id.toString(), label: unit.name }));

  const saleUnits = data?.results?.unit
    ?.filter((unit) => unit.for === "sale-unit")
    .map((unit) => ({ value: unit.id.toString(), label: unit.name }));

  const purchaseUnits = data?.results?.unit
    ?.filter((unit) => unit.for === "purchase-unit")
    .map((unit) => ({ value: unit.id.toString(), label: unit.name }));

  if (productType === "Standard") {
    return (
      <>
        <ProductUnit options={productUnits} isLoading={isLoading} />
        <PurchaseUnit options={purchaseUnits} isLoading={isLoading} />
        <SaleUnit options={saleUnits} isLoading={isLoading} />
      </>
    );
  }
};

export default UnitComponent;
