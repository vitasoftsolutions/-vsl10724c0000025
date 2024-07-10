import { Col, Form, Row } from "antd";
import { company_code } from "../../assets/data/companyCode";
import {
  colLayout,
  fullColLayout,
  mdColLayout,
  rowLayout,
} from "../../layout/FormLayout";
// import { useGetDepartmentsQuery } from "../../redux/services/hrm/department/departmentApi";
import { employeeStatusOptions } from "../../assets/data/employeeStatus";
import { useGetAllDesignationQuery } from "../../redux/services/hrm/designation/designationApi";
import { useGetAllRolesQuery } from "../../redux/services/roles/rolesApi";
import {
  DEFAULT_SELECT_VALUES,
  useGlobalParams,
} from "../../utilities/hooks/useParams";
import { staffIdGenerator } from "../../utilities/lib/staffIdGenerator";
import { CashierComponent } from "../Generator/overview/CashierComponent";
import { DepartmentComponent } from "../ReusableComponent/DepartmentComponent";
import { WarehouseComponent } from "../ReusableComponent/WarehouseComponent";
import CustomCheckbox from "../Shared/Checkbox/CustomCheckbox";
import CustomDatepicker from "../Shared/DatePicker/CustomDatepicker";
import CustomForm from "../Shared/Form/CustomForm";
import CustomInput from "../Shared/Input/CustomInput";
import CustomSelect from "../Shared/Select/CustomSelect";
import CustomUploader from "../Shared/Upload/CustomUploader";
import { useUrlIndexPermission } from "../../utilities/lib/getPermission";

const DesignationComponent = () => {
  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });

  const { data, isFetching } = useGetAllDesignationQuery({ params });

  const options = data?.results?.designation?.map((item) => ({
    value: item?.id?.toString(),
    label: item?.name,
  }));

  return (
    <CustomSelect
      label={"Designation"}
      name={"designation_id"}
      options={options}
      isLoading={isFetching}
      required={true}
    />
  );
};
const EmployeeStatusComponent = () => {
  return (
    <CustomSelect
      label={"Employee Status"}
      name={"employee_status"}
      options={employeeStatusOptions}
      required={true}
    />
  );
};

const StaffIdComponent = () => {
  const form = Form.useFormInstance();
  const joinDate = Form.useWatch("join_date", form);

  const addonBefore = staffIdGenerator(company_code, joinDate);

  return (
    <CustomInput
      label="Staff ID"
      type={"staff"}
      addonBefore={addonBefore}
      name={"staff_id"}
      required={true}
    />
  );
};

const RoleComponent = () => {
  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });

  const { data, isLoading } = useGetAllRolesQuery(
    { params },
    {
      skip: !useUrlIndexPermission(),
    }
  );

  const options = data?.results?.role?.map((role) => ({
    value: role?.id?.toString(),
    label: role?.name,
  }));

  return (
    <>
      <Col {...mdColLayout}>
        <CustomSelect
          label="Role"
          showSearch={true}
          isLoading={isLoading}
          options={options}
          name="role_id"
          required={true}
        />
      </Col>

      <Col {...mdColLayout}>
        <WarehouseComponent />
      </Col>

      <Col {...mdColLayout}>
        <CashierComponent required={false} />
      </Col>
    </>
  );
};

const SoftwareAccessComponent = () => {
  const form = Form.useFormInstance();
  const softwareAccess = Form.useWatch("have_access", form);

  return softwareAccess ? (
    <Row {...rowLayout} className="mt-2">
      <Col {...mdColLayout}>
        <CustomInput
          label="Password"
          name="password"
          required={true}
          type="password"
        />
      </Col>

      <RoleComponent />
    </Row>
  ) : null;
};

const EmployeeForm = (props) => {
  return (
    <CustomForm {...props}>
      <Row {...rowLayout}>
        <Col {...mdColLayout}>
          <CustomInput label="Name" type="text" name={"name"} required={true} />
        </Col>
        <Col {...mdColLayout}>
          <CustomInput label="Email" name={"email"} required={true} />
        </Col>
        <Col {...mdColLayout}>
          <CustomInput label="NID Number" name={"id_number"} required={true} />
        </Col>
        <Col {...mdColLayout}>
          <CustomInput
            label="Phone Number"
            type="phone"
            name={"phone_number"}
            required={true}
          />
        </Col>
        <Col {...mdColLayout}>
          <DepartmentComponent />
        </Col>
        <Col {...mdColLayout}>
          <DesignationComponent />
        </Col>
        <Col {...colLayout}>
          <CustomDatepicker
            label="Joining Date"
            name={"join_date"}
            required={true}
          />
        </Col>
        <Col {...colLayout}>
          <CustomInput
            label="Salary"
            name={"salary"}
            type={"number"}
            required={true}
          />
        </Col>
        <Col {...colLayout}>
          <EmployeeStatusComponent />
        </Col>
        <Col {...fullColLayout}>
          <CustomUploader label={"Profile Picture"} name={"profile_picture"} />
        </Col>
        <Col {...mdColLayout}>
          <CustomUploader label={"NID Front"} name={"nid_front"} />
        </Col>
        <Col {...mdColLayout}>
          <CustomUploader label={"NID Back"} name={"nid_back"} />
        </Col>
        <Col {...mdColLayout}>
          <CustomUploader label={"Joining Document"} name={"joining_doc"} />
        </Col>
        <Col {...mdColLayout}>
          <CustomUploader label={"CV"} name={"cv"} />
        </Col>

        <Col {...fullColLayout}>
          <CustomInput
            label="Address"
            multiple={true}
            type={"textarea"}
            name={"address"}
            required={true}
          />
        </Col>

        <Col {...fullColLayout}>
          <StaffIdComponent />
        </Col>
        <Col {...colLayout}>
          <CustomCheckbox label="Software Access" name={"have_access"} />
        </Col>
      </Row>

      <SoftwareAccessComponent />
    </CustomForm>
  );
};

export default EmployeeForm;
