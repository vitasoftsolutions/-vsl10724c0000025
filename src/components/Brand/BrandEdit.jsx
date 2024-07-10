import { Form } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import defaultUser from "../../assets/data/defaultUserImage";
import {
  useGetBrandDetailsQuery,
  useUpdateBrandMutation,
} from "../../redux/services/brand/brandApi";
import { closeEditDrawer } from "../../redux/services/drawer/drawerSlice";
import { appendToFormData } from "../../utilities/lib/appendFormData";
import { errorFieldsUpdate } from "../../utilities/lib/errorFieldsUpdate";
import { fieldsToUpdate } from "../../utilities/lib/fieldsToUpdate";
import { sanitizeObj } from "../../utilities/lib/sanitizeObj";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import BrandForm from "./BrandForm";

export const BrandEdit = ({ id, setId }) => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [fields, setFields] = useState([]);

  const { isEditDrawerOpen } = useSelector((state) => state.drawer);

  const { data, isFetching } = useGetBrandDetailsQuery({ id }, { skip: !id });

  const [updateBrand, { isLoading }] = useUpdateBrandMutation();

  // const [defaultValue, setDefaultValue] = useState(null);

  useEffect(() => {
    if (data && isEditDrawerOpen) {
      const fieldData = fieldsToUpdate(data);

      let newFieldData = fieldData;

      if (data?.attachments?.length === 0) {
        newFieldData = [
          ...fieldData,
          {
            name: "logo",
            value: [
              {
                url: defaultUser,
              },
            ],
            erros: "",
          },
        ];
      }

      //   ]

      // const newFieldData = [
      //   ...fieldData,
      //   data?.attachments?.length < 1 && {
      //     name: "logo",
      //     value: [
      //       {
      //         url: defaultUser,
      //       },
      //     ],
      //     erros: "",
      //   },
      // ];

      // //console.log(first)

      // //console.log(data?.attachments);
      // if (data?.attachments?.length > 0) {
      //   setDefaultValue(data?.attachments?.[0]?.url);
      // } else {
      //   setDefaultValue(null);
      // }

      setFields(newFieldData);
    }
  }, [data, isEditDrawerOpen, setFields]);

  const handleUpdate = async (values) => {
    const formData = new FormData();

    //console.log(values);

    const postData = {
      ...sanitizeObj(values),
      _method: "PUT",
    };

    if (values?.logo?.length > 0) {
      postData.logo = values?.logo?.[0]?.originFileObj;
    }

    appendToFormData(postData, formData);

    const { data, error } = await updateBrand({
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

  //console.log(fields);

  return (
    <CustomDrawer
      title={"Edit Brand"}
      open={isEditDrawerOpen}
      isLoading={isFetching}
    >
      <BrandForm
        handleSubmit={handleUpdate}
        isLoading={isLoading}
        fields={fields}
        form={form}
      />
    </CustomDrawer>
  );
};
