import { Form } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeCreateDrawer } from "../../redux/services/drawer/drawerSlice";
import { useCreateGiftCardDesignMutation } from "../../redux/services/giftcard/giftcarddesgin/giftCardDesignApi";
import { appendToFormData } from "../../utilities/lib/appendFormData";
import { openNotification } from "../../utilities/lib/openToaster";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import { GiftCardDesignForm } from "./GiftCardDesignForm";

const dataURItoBlob = (dataURI) => {
  const byteString = atob(dataURI?.split(",")[1]);
  const mimeString = dataURI?.split(",")[0].split(":")[1].split(";")[0];
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const int8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    int8Array[i] = byteString.charCodeAt(i);
  }
  return new Blob([arrayBuffer], { type: mimeString });
};

export const GiftCardDesignCreate = () => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [errorFields, setErrorFields] = useState([]);
  const { isCreateDrawerOpen } = useSelector((state) => state.drawer);

  const [createGiftCardDesign, { isLoading }] =
    useCreateGiftCardDesignMutation();

  const handleSubmit = async (values) => {
    if (!form.getFieldValue("frontImage")) {
      // message.error("Please select front image");
      openNotification("info", "Please select front image");
      return;
    }

    if (!form.getFieldValue("backImage")) {
      // message.error("Please select back image");
      openNotification("info", "Please select front image");

      return;
    }

    const frontImageBlob = dataURItoBlob(form.getFieldValue("frontImage"));
    const backImageBlob = dataURItoBlob(form.getFieldValue("backImage"));

    const formData = new FormData();

    const postData = {
      ...values,
      front_side: frontImageBlob,
      back_side: backImageBlob,
    };

    appendToFormData(postData, formData);

    const { data, error } = await createGiftCardDesign({
      formData,
    });

    if (data?.success) {
      dispatch(closeCreateDrawer());
      form.resetFields();
    }
    if (error) {
      const errorFields = Object.keys(error?.data?.errors).map((fieldName) => ({
        name: fieldName,
        errors: error?.data?.errors[fieldName],
      }));
      setErrorFields(errorFields);
    }
  };

  return (
    <CustomDrawer title={"Create Gift Card Design"} open={isCreateDrawerOpen}>
      <GiftCardDesignForm
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        fields={errorFields}
        form={form}
      />
    </CustomDrawer>
  );
};
