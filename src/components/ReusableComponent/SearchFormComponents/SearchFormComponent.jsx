import { Col } from "antd";
import { paymentStatusOptions } from "../../../assets/data/paymentStatus";
import { purchaseStatusOptions } from "../../../assets/data/purchaseStatus";
import { saleStatusOptions } from "../../../assets/data/saleStatus";
// import { mdColLayout } from "../../../layout/FormLayout";
import { barcodeOptions } from "../../../assets/data/barcode";
import { baseUnit } from "../../../assets/data/baseUnit";
import { employeeStatusOptions } from "../../../assets/data/employeeStatus";
import { paymentTypesOptions } from "../../../assets/data/paymentTypes";
import { fullColLayout } from "../../../layout/FormLayout";
import { useGetBrandsQuery } from "../../../redux/services/brand/brandApi";
import { useGetAllCashierQuery } from "../../../redux/services/cashier/cashierApi";
import { useGetAllCategoryQuery } from "../../../redux/services/category/categoryApi";
import { useGetAllCustomerQuery } from "../../../redux/services/customer/customerApi";
import { useGetAllCustomerGroupQuery } from "../../../redux/services/customerGroup/customerGroupApi";
import { useGetAllExpenseCategoryQuery } from "../../../redux/services/expense/expenseCategoryApi";
import { useGetAllGiftCardTypeQuery } from "../../../redux/services/giftcard/giftcardtype/giftCardTypeApi";
import { useGetDepartmentsQuery } from "../../../redux/services/hrm/department/departmentApi";
import { useGetAllDesignationQuery } from "../../../redux/services/hrm/designation/designationApi";
import { useGetAllEmployeeQuery } from "../../../redux/services/hrm/employee/employeeApi";
import { useGetAllProductsQuery } from "../../../redux/services/product/productApi";
import { useGetAllRolesQuery } from "../../../redux/services/roles/rolesApi";
import { useGetAllLeaveTypeQuery } from "../../../redux/services/settings/leaveType/leaveTypeApi";
import { useGetAllSupplierQuery } from "../../../redux/services/supplier/supplierApi";
import { useGetAllTaxQuery } from "../../../redux/services/tax/taxApi";
import { useGetTypesQuery } from "../../../redux/services/types/typesApi";
import { useGetAllUnitQuery } from "../../../redux/services/unit/unitApi";
import { useGetWarehousesQuery } from "../../../redux/services/warehouse/warehouseApi";
import {
  DEFAULT_SELECT_VALUES,
  useGlobalParams,
} from "../../../utilities/hooks/useParams";
import CustomSelect from "../../Shared/Select/CustomSelect";

const mdColLayout = {
  xs: 12,
  // md: 12,
};

const commonProps = {
  showSearch: true,
  mode: "multiple",
  // customStyle: true,
  // noStyle: true,
};

export const ProductTypeFilter = () => {
  const options = [
    { value: "Standard", label: "Standard" },
    { value: "Combo", label: "Combo" },
    { value: "Digital", label: "Digital" },
    { value: "Service", label: "Service" },
  ];

  return (
    <Col {...fullColLayout}>
      <CustomSelect
        {...commonProps}
        label="Product Type"
        options={options}
        name={"product_types"}
      />
    </Col>
  );
};

export const WarehouseFilter = ({
  name = "warehouse_ids",
  fullLayout = false,
  multiple = true,
}) => {
  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });

  const { data, isLoading } = useGetWarehousesQuery({ params });

  const options = data?.results?.warehouse?.map((item) => ({
    value: item?.id?.toString(),
    label: item?.name,
  }));

  return (
    <Col {...(fullLayout ? fullColLayout : mdColLayout)}>
      <CustomSelect
        showSearch={true}
        mode={multiple && "multiple"}
        label={"Warehouse"}
        name={name}
        options={options}
        isLoading={isLoading}
      />
    </Col>
  );
};

export const BrandFilter = () => {
  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });

  const { data, isLoading } = useGetBrandsQuery({ params });

  const options = data?.results?.brand?.map((item) => {
    return {
      value: item?.id.toString(),
      label: item?.name,
    };
  });

  return (
    <Col {...mdColLayout}>
      <CustomSelect
        {...commonProps}
        label="Brand"
        name={"brand_ids"}
        options={options}
        isLoading={isLoading}
      />
    </Col>
  );
};

export const CategoryFilter = ({
  label = "Category",
  name = "category_ids",
}) => {
  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });

  const { data, isLoading } = useGetAllCategoryQuery({ params });

  const options = data?.results?.category?.map((item) => {
    return {
      value: item?.id?.toString(),
      label: item?.name,
    };
  });

  return (
    <Col {...mdColLayout}>
      <CustomSelect
        {...commonProps}
        label={label}
        name={name}
        options={options}
        isLoading={isLoading}
      />
    </Col>
  );
};

export const SupplierFilter = ({ multiple = true, fullLayout = false }) => {
  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });

  const { data, isLoading } = useGetAllSupplierQuery({ params });

  const options = data?.results?.supplier?.map((item) => ({
    value: item?.id?.toString(),
    label: item?.name,
  }));

  return (
    <Col {...(fullLayout ? fullColLayout : mdColLayout)}>
      <CustomSelect
        {...commonProps}
        multiple={multiple && "multiple"}
        label="Supplier"
        name={"supplier_ids"}
        options={options}
        isLoading={isLoading}
      />
    </Col>
  );
};

export const ProductFilter = ({
  name = "product_ids",
  fullLayout = false,
  multiple = true,
}) => {
  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });

  const { data, isLoading } = useGetAllProductsQuery({ params });

  const options = data?.results?.product?.map((item) => ({
    value: item?.id?.toString(),
    label: item?.name,
  }));

  return (
    <Col {...(fullLayout ? fullColLayout : mdColLayout)}>
      <CustomSelect
        {...commonProps}
        label="Product"
        name={name}
        options={options}
        isLoading={isLoading}
        mode={multiple && "multiple"}
      />
    </Col>
  );
};

export const ProductUnitFilter = () => {
  const params = useGlobalParams({
    selectValue: [...DEFAULT_SELECT_VALUES, "for"],
  });

  const { data, isLoading } = useGetAllUnitQuery({ params });

  const options = data?.results?.unit
    ?.filter((unit) => unit.for === "product-unit")
    .map((unit) => ({ value: unit.id.toString(), label: unit.name }));

  return (
    <Col {...mdColLayout}>
      <CustomSelect
        {...commonProps}
        label="Product Unit"
        name={"product_unit__ids"}
        options={options}
        isLoading={isLoading}
      />
    </Col>
  );
};

export const PurchaseUnitFilter = () => {
  const params = useGlobalParams({
    selectValue: [...DEFAULT_SELECT_VALUES, "for"],
  });

  const { data, isLoading } = useGetAllUnitQuery({ params });

  const options = data?.results?.unit
    ?.filter((unit) => unit.for === "purchase-unit")
    .map((unit) => ({ value: unit.id.toString(), label: unit.name }));

  return (
    <Col {...mdColLayout}>
      <CustomSelect
        {...commonProps}
        label="Purchase Unit"
        name={"purchase_unit__ids"}
        options={options}
        isLoading={isLoading}
      />
    </Col>
  );
};

export const SaleUnitFilter = () => {
  const params = useGlobalParams({
    selectValue: [...DEFAULT_SELECT_VALUES, "for"],
  });

  const { data, isLoading } = useGetAllUnitQuery({ params });

  console.log(data);

  const options = data?.results?.unit
    ?.filter((unit) => unit.for === "sale-unit")
    .map((unit) => ({ value: unit.id.toString(), label: unit.name }));

  return (
    <Col {...mdColLayout}>
      <CustomSelect
        {...commonProps}
        label="Sale Unit"
        name={"sale_unit__ids"}
        options={options}
        isLoading={isLoading}
      />
    </Col>
  );
};

export const CashierFilter = () => {
  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });

  const { data, isLoading } = useGetAllCashierQuery({ params });

  const options = data?.results?.cashier?.map((item) => ({
    value: item?.id?.toString(),
    label: item?.name,
  }));

  return (
    <Col {...mdColLayout}>
      <CustomSelect
        {...commonProps}
        label="Cashier"
        name={"cashier_ids"}
        options={options}
        isLoading={isLoading}
      />
    </Col>
  );
};

export const TaxFilter = () => {
  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });

  const { data, isLoading } = useGetAllTaxQuery({ params });

  const options = data?.results?.tax?.map((item) => {
    return {
      value: item.id.toString(),
      label: item.name,
    };
  });

  return (
    <Col {...mdColLayout}>
      <CustomSelect
        {...commonProps}
        label="Tax"
        name={"tax_ids"}
        options={options}
        isLoading={isLoading}
      />
    </Col>
  );
};

export const CustomerFilter = ({ multiple = true, fullLayout = false }) => {
  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });

  const { data, isLoading } = useGetAllCustomerQuery({ params });

  const options = data?.results?.customer?.map((item) => {
    return {
      value: item.id.toString(),
      label: item.name,
    };
  });

  return (
    <Col {...(fullLayout ? fullColLayout : mdColLayout)}>
      <CustomSelect
        {...commonProps}
        multiple={multiple && "multiple"}
        label="Customer"
        name={"customer_ids"}
        options={options}
        isLoading={isLoading}
      />
    </Col>
  );
};

export const GiftCardTypeFilter = () => {
  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });

  const { data, isLoading } = useGetAllGiftCardTypeQuery({ params });

  const options = data?.results?.giftcardtype?.map((item) => {
    return {
      value: item.id.toString(),
      label: item.name,
    };
  });

  return (
    <Col {...mdColLayout}>
      <CustomSelect
        {...commonProps}
        label="Card Type"
        name={"gift_card_type_ids"}
        options={options}
        isLoading={isLoading}
      />
    </Col>
  );
};

export const ExpenseCategoryFilter = () => {
  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });

  const { data, isLoading } = useGetAllExpenseCategoryQuery({ params });

  const options = data?.results?.expensecategory?.map((item) => {
    return {
      value: item.id.toString(),
      label: item.name,
    };
  });

  return (
    <Col {...mdColLayout}>
      <CustomSelect
        {...commonProps}
        label="Expense Category"
        name={"expense_category_ids"}
        options={options}
        isLoading={isLoading}
      />
    </Col>
  );
};

export const CouponTypeFilter = () => {
  const options = [
    {
      value: "Percentage",
      label: "Percentage",
    },
    {
      value: "Fixed",
      label: "Fixed",
    },
  ];

  return (
    <Col {...mdColLayout}>
      <CustomSelect
        {...commonProps}
        label="Coupon Type"
        name={"coupon_types"}
        options={options}
      />
    </Col>
  );
};

export const DesignationFilter = () => {
  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });

  const { data, isLoading } = useGetAllDesignationQuery({ params });

  const options = data?.results?.designation?.map((item) => ({
    value: item?.id?.toString(),
    label: item?.name,
  }));

  return (
    <Col {...mdColLayout}>
      <CustomSelect
        {...commonProps}
        label="Designation"
        name={"designation_ids"}
        options={options}
        isLoading={isLoading}
      />
    </Col>
  );
};

export const DepartmentFilter = () => {
  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });

  const { data, isLoading } = useGetDepartmentsQuery({ params });

  const options = data?.results?.department?.map((item) => {
    return {
      value: item.id.toString(),
      label: item.name,
    };
  });

  return (
    <Col {...mdColLayout}>
      <CustomSelect
        {...commonProps}
        label="Department"
        name={"department_ids"}
        options={options}
        isLoading={isLoading}
      />
    </Col>
  );
};

export const RoleFilter = () => {
  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });

  const { data, isLoading } = useGetAllRolesQuery({ params });

  const options = data?.results?.role?.map((item) => {
    return {
      value: item.id.toString(),
      label: item.name,
    };
  });

  return (
    <Col {...mdColLayout}>
      <CustomSelect
        {...commonProps}
        label="Role"
        name={"role_ids"}
        options={options}
        isLoading={isLoading}
      />
    </Col>
  );
};

export const EmployeeFilter = () => {
  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });

  const { data, isLoading } = useGetAllEmployeeQuery({ params });

  const options = data?.results?.employee?.map((item) => {
    return {
      value: item.id.toString(),
      label: item.name,
    };
  });

  return (
    <Col {...mdColLayout}>
      <CustomSelect
        {...commonProps}
        label="Employee"
        name={"employee_ids"}
        options={options}
        isLoading={isLoading}
      />
    </Col>
  );
};

export const PurchaseStatusFilter = () => {
  return (
    <Col {...mdColLayout}>
      <CustomSelect
        {...commonProps}
        label="Purchase Status"
        name="purchase_status"
        options={purchaseStatusOptions}
      />
    </Col>
  );
};

export const BarcodeFilter = () => {
  return (
    <Col {...mdColLayout}>
      <CustomSelect
        {...commonProps}
        label="Barcode"
        name="barcode"
        options={barcodeOptions}
      />
    </Col>
  );
};

export const EmployeeStatusFilter = () => {
  return (
    <Col {...mdColLayout}>
      <CustomSelect
        {...commonProps}
        label="Empoloyee Status"
        name="employee_status"
        options={employeeStatusOptions}
      />
    </Col>
  );
};

export const SaleStatusFilter = () => {
  return (
    <Col {...mdColLayout}>
      <CustomSelect
        {...commonProps}
        label="Sale Status"
        name={"sale_status"}
        options={saleStatusOptions}
      />
    </Col>
  );
};

export const PaymentStatusFilter = () => {
  return (
    <Col {...mdColLayout}>
      <CustomSelect
        {...commonProps}
        label="Payment Status"
        name="payment_status"
        options={paymentStatusOptions}
      />
    </Col>
  );
};

export const LeaveTypeFilter = () => {
  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });
  const { data, isLoading } = useGetAllLeaveTypeQuery({ params });

  const options = data?.results?.leavetype?.map((item) => ({
    value: item?.id?.toString(),
    label: item?.name,
  }));

  return (
    <Col {...mdColLayout}>
      <CustomSelect
        {...commonProps}
        label={"Leave Type"}
        name={"leave_type_ids"}
        options={options}
        isLoading={isLoading}
      />
    </Col>
  );
};

export const PaymentTypeFilter = () => {
  return (
    <Col {...mdColLayout}>
      <CustomSelect
        {...commonProps}
        label="Payment Type"
        name="peyment_types"
        options={paymentTypesOptions}
      />
    </Col>
  );
};

export const CustomerGroupFilter = () => {
  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });

  const { data, isLoading } = useGetAllCustomerGroupQuery({ params });

  const options = data?.results?.customergroup?.map((item) => ({
    value: item.id?.toString(),
    label: item.name,
  }));

  return (
    <Col {...mdColLayout}>
      <CustomSelect
        {...commonProps}
        label="Customer Group"
        name="customer_group_ids"
        options={options}
        isLoading={isLoading}
      />
    </Col>
  );
};

export const BaseUnitFilter = () => {
  const options = baseUnit.map(({ name, symbol }) => {
    return { label: `${name} (${symbol})`, value: name };
  });

  return (
    <Col {...mdColLayout}>
      <CustomSelect
        {...commonProps}
        label="Base Unit"
        name="base_units"
        options={options}
      />
    </Col>
  );
};

export const UnitForFilter = () => {
  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });

  const { data, isLoading } = useGetTypesQuery({ params });

  const options = data?.results?.type?.map((item) => ({
    value: item.id?.toString(),
    label: item.name,
  }));

  return (
    <Col {...mdColLayout}>
      <CustomSelect
        {...commonProps}
        label="Unit For"
        name="type_ids"
        options={options}
        isLoading={isLoading}
      />
    </Col>
  );
};
