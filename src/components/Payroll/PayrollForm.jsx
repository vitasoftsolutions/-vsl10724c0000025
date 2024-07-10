import { Col, Form, Row } from "antd";
import {
  colLayout,
  fullColLayout,
  mdColLayout,
  rowLayout,
} from "../../layout/FormLayout";
import {
  useGetAllEmployeeQuery,
  useGetEmployeeDetailsQuery,
} from "../../redux/services/hrm/employee/employeeApi";
import { DepartmentComponent } from "../ReusableComponent/DepartmentComponent";
import CustomCheckbox from "../Shared/Checkbox/CustomCheckbox";
import CustomDatepicker from "../Shared/DatePicker/CustomDatepicker";
import CustomForm from "../Shared/Form/CustomForm";
import CustomInput from "../Shared/Input/CustomInput";
import CustomSelect from "../Shared/Select/CustomSelect";
import { paymentTypesOptions } from "../../assets/data/paymentTypes";
import {
  DEFAULT_SELECT_VALUES,
  useGlobalParams,
} from "../../utilities/hooks/useParams";
import { useUrlIndexPermission } from "../../utilities/lib/getPermission";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useCurrency } from "../../redux/services/pos/posSlice";

const EmployeeComponent = () => {
  const form = Form.useFormInstance();
  const departmentId = Form.useWatch("department_ids", form);

  const params = useGlobalParams({
    params: {
      department_id: departmentId,
    },
    selectValue: DEFAULT_SELECT_VALUES,
  });

  const isPermitted = useUrlIndexPermission();

  const { data, isFetching } = useGetAllEmployeeQuery(
    { params },
    {
      skip: !departmentId && !isPermitted,
    }
  );

  const options = data?.results?.employee?.map((item) => ({
    value: item?.id?.toString(),
    label: item?.name,
  }));

  return (
    <CustomSelect
      label="Employee"
      name="employee_id"
      options={options}
      required={true}
      isLoading={isFetching}
    />
  );
};

const PaymentTypeComponent = () => {
  return (
    <CustomSelect
      label="Payment Type"
      name="peyment_type"
      options={paymentTypesOptions}
      required={true}
    />
  );
};

export const PayrollForm = (props) => {
  const employeeId = Form.useWatch("employee_id", props.form);
  const { data } = useGetEmployeeDetailsQuery(
    {
      id: employeeId,
    },
    {
      skip: !employeeId,
    }
  );

  useEffect(() => {
    props.form.setFieldsValue({
      salary: data?.salary,
    });
  }, [data, props.form, employeeId]);

  const currency = useSelector(useCurrency);

  return (
    <CustomForm {...props}>
      <Row {...rowLayout}>
        <Col {...colLayout}>
          <CustomDatepicker name="date" label="Date" required={true} />
        </Col>
        <Col {...colLayout}>
          <DepartmentComponent name="department_ids" />
        </Col>
        <Col {...colLayout}>
          <EmployeeComponent />
        </Col>
        <Col {...mdColLayout}>
          <PaymentTypeComponent />
        </Col>
        <Col {...mdColLayout}>
          <CustomInput
            label="Salary"
            name="salary"
            type={"number_with_money"}
            suffix={currency?.name}
            required={true}
          />
        </Col>
        <Col {...mdColLayout}>
          <CustomInput
            label="Bonus"
            name="bonus"
            type={"number_with_money"}
            suffix={currency?.name}
          />
        </Col>
        <Col {...mdColLayout}>
          <CustomInput
            label="Loan"
            name="loan"
            type={"number_with_money"}
            suffix={currency?.name}
          />
        </Col>

        <Col {...fullColLayout}>
          <CustomInput
            label="Description"
            name="description"
            type={"textarea"}
          />
        </Col>

        <Col {...fullColLayout}>
          <CustomCheckbox name="is_send_email" label="Send Email" />
        </Col>
      </Row>
    </CustomForm>
  );
};
