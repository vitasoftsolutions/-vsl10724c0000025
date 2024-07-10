import { Button, Form } from "antd";
import { useEffect, useState } from "react";
import ColorSettingComponent from "../../../components/Settings/GeneralSettings/ColorSetting";
import CompanySetting from "../../../components/Settings/GeneralSettings/CompanySetting";
import CurrencySettingComponent from "../../../components/Settings/GeneralSettings/CurrencySetting";
import StaffSetting from "../../../components/Settings/GeneralSettings/StaffSetting";
import TimeSetting from "../../../components/Settings/GeneralSettings/TimeSetting";
import CustomLogoUploader from "../../../components/Shared/Upload/CustomLogoUploader";
import { useUpdateGeneralSettingsMutation } from "../../../redux/services/settings/generalSettings/generalSettingsApi";
import { fieldsToUpdate } from "../../../utilities/lib/fieldsToUpdate";

const GeneralSettingForm = ({ data }) => {
  const [form] = Form.useForm();
  const [fields, setFields] = useState([]);

  const [updateGeneralSettings, { isLoading }] =
    useUpdateGeneralSettingsMutation();

  useEffect(() => {
    if (data) {
      const fieldData = fieldsToUpdate(data);
      setFields(fieldData);
    }
  }, [data]);

  const handleSubmit = async (values) => {
    const { logo, primary_color, secendary_color, ...rest } = values;

    const formData = new FormData();

    Object.entries(rest).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (form.isFieldTouched("logo")) {
      formData.append("logo", logo[0]);
    }

    if (typeof primary_color === "object") {
      formData.append("primary_color", primary_color.toHexString());
    }

    if (typeof secendary_color === "object") {
      formData.append("secendary_color", secendary_color.toHexString());
    }

    formData.append("_method", "PUT");

    await updateGeneralSettings({
      data: formData,
    });
  };

  const onFinish = (values) => {
    form
      .validateFields({
        validateOnly: true,
      })
      .then(() => {
        handleSubmit(values);
      })
      .catch((error) => {
        console.error("Validation error:", error);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };

  return (
    <div className="pt-10">
      <Form
        form={form}
        fields={fields}
        onFinish={onFinish}
        layout="vertical"
        autoComplete="on"
        onFinishFailed={onFinishFailed}
        disabled={!data}
      >
        <CustomLogoUploader name={"logo"} />
        <ColorSettingComponent />
        <CompanySetting />
        <TimeSetting />
        <CurrencySettingComponent />
        <StaffSetting />
        {/* <DeveloperSettingComponent /> */}

        <div className="w-full flex gap-3 justify-end items-center">
          <Button htmlType="submit" type="primary" loading={isLoading}>
            Update
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default GeneralSettingForm;
