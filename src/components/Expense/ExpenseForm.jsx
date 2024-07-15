import { Col, Row } from "antd";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { fullColLayout, mdColLayout, rowLayout } from "../../layout/FormLayout";
import { useGetAllExpenseCategoryQuery } from "../../redux/services/expense/expenseCategoryApi";
import { useCurrency } from "../../redux/services/pos/posSlice";
import {
  DEFAULT_SELECT_VALUES,
  useGlobalParams,
} from "../../utilities/hooks/useParams";
import { getCurrentDate } from "../../utilities/lib/currentDate";
import { WarehouseComponent } from "../ReusableComponent/WarehouseComponent";
import CustomDatepicker from "../Shared/DatePicker/CustomDatepicker";
import CustomForm from "../Shared/Form/CustomForm";
import CustomInput from "../Shared/Input/CustomInput";
import CustomSelect from "../Shared/Select/CustomSelect";

const ExpenseCategoryComponent = () => {
  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });

  const { data, isLoading } = useGetAllExpenseCategoryQuery({ params });

  const options = data?.results?.expensecategory?.map((item) => ({
    value: item.id?.toString(),
    label: item.name,
  }));

  return (
    <CustomSelect
      label={"Expense Category"}
      name={"expense_category_id"}
      options={options}
      isLoading={isLoading}
      required={true}
    />
  );
};

export const ExpenseForm = (props) => {
  const currency = useSelector(useCurrency);

  useEffect(() => {
    props.form.setFieldValue("date", getCurrentDate);
  }, [props]);

  return (
    <CustomForm {...props}>
      <Row {...rowLayout}>
        <Col {...mdColLayout}>
          <WarehouseComponent />
        </Col>
        <Col {...mdColLayout}>
          <ExpenseCategoryComponent />
        </Col>
        <Col {...mdColLayout}>
          <CustomInput label="Expense By" name={"expense_by"} />
        </Col>
        <Col {...mdColLayout}>
          <CustomInput
            label="Amount"
            type={"number_with_money"}
            required={true}
            name={"amount"}
            suffix={currency?.name}
          />
        </Col>
        <Col {...mdColLayout}>
          <CustomDatepicker
            label="Date"
            type={"date"}
            name={"date"}
            required={true}
          />
        </Col>
        <Col {...fullColLayout}>
          <CustomInput
            label="Reason"
            type={"textarea"}
            name={"reason"}
            required={true}
          />
        </Col>
      </Row>
    </CustomForm>
  );
};
