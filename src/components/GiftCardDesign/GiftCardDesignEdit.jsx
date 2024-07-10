import { Form } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeEditDrawer } from "../../redux/services/drawer/drawerSlice";
import {
  useGetGiftCardDesignDetailsQuery,
  useUpdateGiftCardDesignMutation,
} from "../../redux/services/giftcard/giftcarddesgin/giftCardDesignApi";
import { appendToFormData } from "../../utilities/lib/appendFormData";
import { errorFieldsUpdate } from "../../utilities/lib/errorFieldsUpdate";
import { fieldsToUpdate } from "../../utilities/lib/fieldsToUpdate";
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

export const GiftCardDesignEdit = ({ id, setId }) => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [fields, setFields] = useState([]);

  const { isEditDrawerOpen } = useSelector((state) => state.drawer);

  const { data, isFetching } = useGetGiftCardDesignDetailsQuery(
    { id },
    { skip: !id }
  );

  const [updateGiftCardDesign, { isLoading }] =
    useUpdateGiftCardDesignMutation();

  useEffect(() => {
    if (data) {
      const fieldData = fieldsToUpdate(data);

      const frontSideUrl = data?.attachments?.find(
        (item) => item.label === "front_side"
      )?.url;

      const backSideUrl = data?.attachments?.find(
        (item) => item.label === "back_side"
      )?.url;

      form.setFieldValue("frontImageUrl", frontSideUrl);
      form.setFieldValue("backImageUrl", backSideUrl);

      setFields(fieldData);
    }
  }, [data, form, setFields]);

  const handleUpdate = async (values) => {
    const formData = new FormData();

    const postData = {
      ...values,
      _method: "PUT",
    };

    if (form.getFieldValue("frontImage")) {
      const frontImageBlob = dataURItoBlob(form.getFieldValue("frontImage"));
      postData.front_side = frontImageBlob;
    }

    if (form.getFieldValue("backImage")) {
      const backImageBlob = dataURItoBlob(form.getFieldValue("backImage"));
      postData.back_side = backImageBlob;
    }

    appendToFormData(postData, formData);

    const { data, error } = await updateGiftCardDesign({
      id,
      data: formData,
    });
    if (data?.success) {
      setId(undefined);
      dispatch(closeEditDrawer());
    }
    if (error) {
      const errorFields = errorFieldsUpdate(fields, error);
      setFields(errorFields);
    }
  };

  return (
    <CustomDrawer
      title={"Edit Gift Card Design"}
      open={isEditDrawerOpen}
      isLoading={isFetching}
    >
      <GiftCardDesignForm
        handleSubmit={handleUpdate}
        isLoading={isLoading}
        fields={fields}
        form={form}
      />
    </CustomDrawer>
  );
};
