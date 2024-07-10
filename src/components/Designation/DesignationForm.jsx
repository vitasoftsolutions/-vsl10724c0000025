import { Col, Row } from "antd";
import { mdColLayout, rowLayout } from "../../layout/FormLayout";
import { DepartmentComponent } from "../ReusableComponent/DepartmentComponent";
import CustomForm from "../Shared/Form/CustomForm";
import CustomInput from "../Shared/Input/CustomInput";

// const DepartmentComponent = () => {
//   const { data, isFetching } = useGetDepartmentsQuery({});

//   const options = data?.results?.department?.map((item) => ({
//     value: item?.id?.toString(),
//     label: item?.name,
//   }));

//   return (
//     <CustomSelect
//       label={"Department"}
//       name={"department_id"}
//       options={options}
//       isLoading={isFetching}
//       required={true}
//     />
//   );
// };

export const DesignationForm = (props) => {
  return (
    <CustomForm {...props}>
      <Row {...rowLayout}>
        <Col {...mdColLayout}>
          <CustomInput
            label="Name"
            type={"text"}
            required={true}
            name={"name"}
          />
        </Col>
        <Col {...mdColLayout}>
          <DepartmentComponent />
        </Col>
      </Row>
    </CustomForm>
  );
};
