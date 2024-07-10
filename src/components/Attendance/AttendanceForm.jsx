import { Col, Form, Row } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import {
  fullColLayout,
  largeLayout,
  mdColLayout,
  rowLayout,
} from "../../layout/FormLayout";
import { DepartmentComponent } from "../ReusableComponent/DepartmentComponent";
import { EmployeeComponent } from "../ReusableComponent/EmployeeComponent";
import CustomDatepicker from "../Shared/DatePicker/CustomDatepicker";
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

// const EmployeeComponent = () => {
//   const { data, isFetching } = useGetAllEmployeeQuery({});

//   const options = data?.results?.employee?.map((item) => ({
//     value: item?.id?.toString(),
//     label: item?.name,
//   }));

//   return (
//     <CustomSelect
//       label={"Employee"}
//       name={"employee_id"}
//       options={options}
//       isLoading={isFetching}
//       required={true}
//     />
//   );
// };

const DateComponent = () => {
  const form = Form.useFormInstance();
  const currentDate = dayjs(new Date());
  const checkIn = Form.useWatch("check_in", form);
  const checkOut = Form.useWatch("check_out", form);

  const hours = Form.useWatch("hours", form);

  useEffect(() => {
    form.setFieldValue("date", currentDate);
  }, [currentDate, form]);

  useEffect(() => {
    if (checkIn && checkOut) {
      const timeDiff = checkOut.diff(checkIn, "second");

      const hours = Math.floor(timeDiff / 3600);
      const minutes = Math.floor((timeDiff % 3600) / 60);
      const seconds = timeDiff % 60;

      const formattedTime = `${String(hours).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

      form.setFieldValue("hours", formattedTime);
    }
  }, [form, checkIn, checkOut, hours]);

  return (
    <>
      <Col {...largeLayout}>
        <CustomDatepicker label="Date" required={true} name={"date"} />
      </Col>
      <Col {...largeLayout}>
        <CustomDatepicker
          label="Check In"
          type="time"
          picker="time"
          required={true}
          name={"check_in"}
          placeholder={"Check In"}
        />
      </Col>
      <Col {...largeLayout}>
        <CustomDatepicker
          label="Check Out"
          type="time"
          picker="time"
          name={"check_out"}
          placeholder={"Check Out"}
        />
      </Col>
      <Col {...largeLayout}>
        <CustomInput
          label="Total Hours"
          type="text"
          //   required={true}
          name={"hours"}
        />
      </Col>
    </>
  );
};

export const AttendanceForm = (props) => {
  return (
    <CustomForm {...props}>
      <Row {...rowLayout}>
        <Col {...mdColLayout}>
          <DepartmentComponent />
        </Col>
        <Col {...mdColLayout}>
          <EmployeeComponent />
        </Col>

        <DateComponent />

        <Col {...fullColLayout}>
          <CustomInput
            label="Description"
            type={"textarea"}
            name={"description"}
          />
        </Col>
      </Row>
    </CustomForm>
  );
};
