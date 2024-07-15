import { Form } from "antd";
import { useEffect, useState } from "react";
import {
  useGetAllPermissionQuery,
  useGetUserRolePermissionQuery,
  useUpdateRolePermissionMutation,
} from "../../redux/services/rolePermission/rolePermissionApi";
import CustomCheckbox from "../Shared/Checkbox/CustomCheckbox";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import CustomForm from "../Shared/Form/CustomForm";
import CustomTable from "../Shared/Table/CustomTable";

const actionKeys = [
  "accesstoken.issueToken",
  "authorization.authorize",
  "transienttoken.refresh",
  "approveauthorization.approve",
  "denyauthorization.deny",
  "authorizedaccesstoken.forUser",
  "authorizedaccesstoken.destroy",
  "client.forUser",
  "scope.all",
  "personalaccesstoken.forUser",
  "personalaccesstoken.store",
  "personalaccesstoken.destroy",
  "csrfcookie.show",
  "handlerequests.handleUpdate",
  "frontendassets.returnJavaScriptAsFile",
  "frontendassets.maps",
  "fileupload.handle",
  "filepreview.handle",
];

function filterActions(jsonData) {
  if (!jsonData) return [];

  let copiedData = JSON.parse(JSON.stringify(jsonData));

  let filteredModules = copiedData.filter((module) => {
    let filteredActions = module.actions.filter((action) => {
      return !actionKeys.includes(action.name);
    });

    module.actions = filteredActions;

    return filteredActions.length > 0;
  });

  return filteredModules;
}

const columns = [
  {
    title: "Module Name",
    dataIndex: "name",
    key: "name",
    align: "left",
    fixed: "left",
    width: 250,
    render: (name) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {name}
      </span>
    ),
  },
  {
    //action
    title: "Actions",
    dataIndex: "action",
    key: "action",
    align: "left",
    render: (role, record) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {role?.map((action, index) => {
          const label = action?.name?.split(".")[1];
          const isLongLabel = label && label.length > 15;

          return (
            <div
              key={action?.id ?? index}
              className={`${isLongLabel ? "col-span-2" : ""}`}
            >
              <CustomCheckbox
                name={["permission", record.name, label]}
                label={label}
                onChange={record.onChange}
              />
            </div>
          );
        })}
      </span>
    ),
  },
];

const SetRolePermission = ({ changePermissionId, open, closeDrawer }) => {
  const [form] = Form.useForm();
  const [selectedRows, setSelectedRows] = useState([]);

  const { data: rolePermission, isLoading } = useGetAllPermissionQuery();
  const filteredData = filterActions(rolePermission);

  const removeItem = (item) => {
    const itemExists = selectedRows.some((rowItem) => rowItem.id === item.id);

    if (itemExists) {
      const newRows = selectedRows.filter((rowItem) => rowItem.id !== item.id);
      setSelectedRows(newRows);
    }
  };

  const addItem = (item) => {
    setSelectedRows([...selectedRows, item]);
  };

  const onChange = (e) => {
    const { id } = e.target;
    const itemName = id.split("_")[1];
    const formData = form.getFieldValue(["permission", itemName]);

    console.log(e.target);

    console.log(formData);

    const shouldRemove = Object.keys(formData).some((key) => !formData[key]);

    const shouldUpdate = Object.values(formData).every((value) => value);

    console.log(shouldRemove, shouldUpdate);

    const item = dataSource.find((item) => item.name === itemName);

    if (shouldRemove) {
      removeItem(item);
    }
    if (shouldUpdate) {
      addItem(item);
    }
  };

  const dataSource = filteredData?.map((item) => {
    const { module, actions } = item ?? {};
    return {
      id: module,
      name: module,
      action: actions,
      onChange,
    };
  });

  const { data, isFetching } = useGetUserRolePermissionQuery(
    { params: { role_id: changePermissionId } },
    { skip: !rolePermission }
  );

  useEffect(() => {
    if (data && open) {
      data.map((item) => {
        item?.actions?.map((action) => {
          const label = action?.name?.split(".")[1];

          form.setFieldValue([`permission`, item.module, label], true);
        });
      });
    }
  }, [data, form, open]);

  useEffect(() => {
    if (data) {
      const newSelectedRows = [];

      dataSource.forEach((firstItem) => {
        data.some((secondItem) => {
          if (firstItem.name === secondItem.module) {
            const areLengthsEqual =
              firstItem.action.length === secondItem.actions.length;

            if (areLengthsEqual) {
              newSelectedRows.push(firstItem);
            }
            return true;
          }
          return false;
        });
      });

      setSelectedRows(newSelectedRows);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  console.log(form.getFieldsValue({}));

  const changeSelectedRows = (newSelectedRows) => {
    // Clear existing permissions if no rows are selected
    if (!newSelectedRows.length) {
      dataSource.map((item) => {
        item.action.map((action) => {
          const label = action.name.split(".")[1];
          form.setFieldsValue({
            permission: {
              [item.name]: {
                [label]: false,
              },
            },
          });
        });
      });
      setSelectedRows([]);
      return;
    }

    // Set all selected items to true
    if (newSelectedRows.length === dataSource.length) {
      console.log(newSelectedRows.length, dataSource.length);

      console.log(newSelectedRows);

      newSelectedRows.map((item) => {
        item.action.map((action) => {
          const label = action.name.split(".")[1];
          form.setFieldsValue({
            permission: {
              [item.name]: {
                [label]: true,
              },
            },
          });
        });
      });

      console.log(newSelectedRows);
      setSelectedRows(newSelectedRows);
      return;
    }

    // Handle removed rows
    const deletedRows = selectedRows.filter(
      (row) => !newSelectedRows.some((newRow) => newRow.id === row.id)
    );

    console.log(deletedRows);
    deletedRows.forEach((deletedRow) => {
      deletedRow.action.forEach((action) => {
        const label = action.name.split(".")[1];
        form.setFieldsValue({
          permission: {
            [deletedRow.name]: {
              [label]: false,
            },
          },
        });
      });
    });

    // Handle added rows
    const addedRows = newSelectedRows.filter(
      (row) => !selectedRows.some((selectedRow) => selectedRow.id === row.id)
    );

    console.log(addedRows);
    addedRows.forEach((addedRow) => {
      addedRow.action.forEach((action) => {
        const label = action.name.split(".")[1];
        form.setFieldsValue({
          permission: {
            [addedRow.name]: {
              [label]: true,
            },
          },
        });
      });
    });

    setSelectedRows(newSelectedRows);
  };

  const [updateRolePermission, { isLoading: isRoleUpdating }] =
    useUpdateRolePermissionMutation();

  const handleSubmit = async (values) => {
    const { permission } = values;

    const transformedObject = {};

    for (const [key, value] of Object.entries(permission)) {
      if (typeof value === "object" && value !== null) {
        for (const [subKey, subValue] of Object.entries(value)) {
          if (subValue !== undefined) {
            transformedObject[`${key.toLowerCase()}.${subKey}`] = subValue;
          }
        }
      } else {
        if (value !== undefined) {
          transformedObject[`${key.toLowerCase()}`] = value;
        }
      }
    }

    const formData = new FormData();

    const postObj = {
      role_id: changePermissionId,
      ...transformedObject,
    };

    actionKeys.forEach((key) => {
      postObj[key] = true;
    });

    Object.keys(postObj).forEach((key) => {
      formData.append(key, postObj[key]);
    });

    const { data, error } = await updateRolePermission({
      data: formData,
    });

    if (data?.success) {
      closeDrawer();
      form.resetFields();
    }

    if (error) {
      const errorFields = Object.keys(error?.data?.errors).map((fieldName) => ({
        name: fieldName,
        errors: error?.data?.errors[fieldName],
      }));

      // setErrorFields(errorFields);

      console.log(errorFields);
    }
  };

  return (
    <CustomDrawer
      title={"Change Permission"}
      width={1400}
      open={open}
      onClose={closeDrawer}
      isLoading={isLoading}
    >
      <CustomForm
        form={form}
        handleSubmit={handleSubmit}
        isLoading={isRoleUpdating}
      >
        <CustomTable
          columns={columns}
          dataSource={dataSource}
          showPaging={false}
          status={false}
          created_at={false}
          action={false}
          isRowSelection={true}
          setSelectedRows={setSelectedRows}
          selectedRows={selectedRows}
          changeSelectedRows={changeSelectedRows}
          tableStyleProps={{
            scroll: {
              y: "73vh",
            },
          }}
          isLoading={isFetching}
        />
      </CustomForm>
    </CustomDrawer>
  );
};

export default SetRolePermission;
