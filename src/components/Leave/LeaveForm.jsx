import { Col, Form, Row } from "antd";
import { useEffect } from "react";
import {
  colLayout,
  fullColLayout,
  mdColLayout,
  rowLayout,
} from "../../layout/FormLayout";
import { useGetAllLeaveTypeQuery } from "../../redux/services/settings/leaveType/leaveTypeApi";
import { disabledDate, getCurrentDate } from "../../utilities/lib/currentDate";
import { DepartmentComponent } from "../ReusableComponent/DepartmentComponent";
import { EmployeeComponent } from "../ReusableComponent/EmployeeComponent";
import CustomCheckbox from "../Shared/Checkbox/CustomCheckbox";
import CustomDatepicker from "../Shared/DatePicker/CustomDatepicker";
import CustomForm from "../Shared/Form/CustomForm";
import CustomInput from "../Shared/Input/CustomInput";
import CustomRadio from "../Shared/Radio/CustomRadio";
import CustomSelect from "../Shared/Select/CustomSelect";
import CustomUploader from "../Shared/Upload/CustomUploader";
import {
  DEFAULT_SELECT_VALUES,
  useGlobalParams,
} from "../../utilities/hooks/useParams";
import { useUrlIndexPermission } from "../../utilities/lib/getPermission";

const LeaveTypeComponent = () => {
  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });
  const { data, isFetching } = useGetAllLeaveTypeQuery(
    { params },
    {
      skip: !useUrlIndexPermission(),
    }
  );

  const options = data?.results?.leavetype?.map((item) => ({
    value: item?.id?.toString(),
    label: item?.name,
  }));

  return (
    <CustomSelect
      label={"Leave Type"}
      name={"leave_type_id"}
      options={options}
      isLoading={isFetching}
      required={true}
    />
  );
};

const LeaveDurationComponent = () => {
  const form = Form.useFormInstance();

  useEffect(() => {
    form.setFieldValue("leave_duration", "single-day");
  }, [form]);

  const options = [
    {
      value: "single-day",
      label: <span className="font-semibold">Single Day</span>,
    },
    {
      value: "multi-day",
      label: <span className="font-semibold">Multiple Days</span>,
    },
    {
      value: "half-day",
      label: <span className="font-semibold">Half Day</span>,
    },
    {
      value: "hours",
      label: <span className="font-semibold">Hours</span>,
    },
  ];
  return (
    <CustomRadio
      label={"Leave Duration"}
      name={"leave_duration"}
      options={options}
      required={true}
    />
  );
};

const LeaveStartComponent = () => {
  const form = Form.useFormInstance();

  const LeaveDuration = Form.useWatch("leave_duration", form);

  useEffect(() => {
    form.setFieldValue("leave_start_date", getCurrentDate);
  }, [form]);

  return LeaveDuration === "single-day" ? (
    <Col {...fullColLayout}>
      <CustomDatepicker name="leave_start_date" label="Date" required={true} />{" "}
    </Col>
  ) : (
    <Col {...mdColLayout}>
      <CustomDatepicker
        name="leave_start_date"
        label={LeaveDuration === "multi-day" ? "Start Date" : "Date"}
        required={true}
      />
    </Col>
  );
};

const HalfDayComponent = () => {
  const form = Form.useFormInstance();
  const durationType = Form.useWatch("leave_duration", form);

  const options = [
    {
      value: "first-half",
      label: <span className="font-semibold">First Half</span>,
    },
    {
      value: "second-half",
      label: <span className="font-semibold">Second Half</span>,
    },
  ];

  return (
    durationType === "half-day" && (
      <Col {...mdColLayout}>
        <CustomRadio
          label={"Select Half Day"}
          name={"leave_half"}
          options={options}
          required={true}
        />
      </Col>
    )
  );
};

const LeaveEndComponent = () => {
  const form = Form.useFormInstance();
  const durationType = Form.useWatch("leave_duration", form);

  useEffect(() => {
    if (durationType === "single-day") {
      form.setFieldValue("leave_end_date", getCurrentDate);
    }
  }, [durationType, form]);

  const disabledDateStart = (current) => {
    return disabledDate(current, form.getFieldValue("leave_start_date"));
  };

  return (
    durationType === "multi-day" && (
      <Col {...mdColLayout}>
        <CustomDatepicker
          name="leave_end_date"
          label="End Date"
          disabledDate={disabledDateStart}
          required={true}
        />
      </Col>
    )
  );
};
const HoursComponent = () => {
  const form = Form.useFormInstance();
  const durationType = Form.useWatch("leave_duration", form);
  useEffect(() => {
    if (durationType === "hours") {
      form.setFieldValue("leave_end_date", getCurrentDate);
    }
  }, [durationType, form]);

  return (
    durationType === "hours" && (
      <Col {...mdColLayout}>
        <Row {...rowLayout}>
          <Col {...mdColLayout}>
            <CustomDatepicker
              name="leave_start_time"
              label="Leave Start Time"
              placeholder="Leave Start Time"
              required={true}
            />
          </Col>

          <Col {...mdColLayout}>
            <CustomDatepicker
              name="leave_end_time"
              label="Leave End Time"
              placeholder="Leave End Time"
              required={true}
            />
          </Col>
        </Row>
      </Col>
    )
  );
};

export const LeaveForm = (props) => {
  return (
    <CustomForm {...props}>
      <Row {...rowLayout}>
        <Col {...colLayout}>
          <DepartmentComponent />
        </Col>
        <Col {...colLayout}>
          <EmployeeComponent />
        </Col>
        <Col {...colLayout}>
          <LeaveTypeComponent />
        </Col>
        <Col {...fullColLayout}>
          <LeaveDurationComponent />
        </Col>
        <LeaveStartComponent />

        <HalfDayComponent />

        <LeaveEndComponent />

        <HoursComponent />

        <Col {...fullColLayout}>
          <CustomUploader name="attachment" label={"Attachment"} />
        </Col>

        <Col {...fullColLayout}>
          <CustomInput
            label="Description"
            name="description"
            type={"textarea"}
            required={true}
          />
        </Col>

        <Col {...fullColLayout}>
          <CustomCheckbox name="is_send_email" label="Send Email" />
        </Col>
      </Row>
    </CustomForm>
  );
};
