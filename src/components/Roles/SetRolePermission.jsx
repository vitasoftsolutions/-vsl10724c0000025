import { Form } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useGetAllRolePermissionQuery } from "../../redux/services/rolePermission/rolePermissionApi";
import CustomCheckbox from "../Shared/Checkbox/CustomCheckbox";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import CustomForm from "../Shared/Form/CustomForm";
import CustomTable from "../Shared/Table/CustomTable";

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
    render: (text, record) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 ">
        {text?.map((action, index) => {
          const label = action?.name?.split(".")[1];

          return (
            <div key={action?.id ?? index}>
              <CustomCheckbox
                name={["permission", record.name, label]}
                label={label}
              />
            </div>
          );
        })}
      </span>
    ),
  },
];

function filterMissingObject(oldValue, newValue) {
  const newValueIds = {};
  newValue.forEach((obj) => {
    newValueIds[obj.id] = true;
  });

  const filteredObject = oldValue.find((obj) => !newValueIds[obj.id]);

  return filteredObject;
}

// function filterObjects(obj) {
//   const filteredObj = {};

//   if (!obj) {
//     return filteredObj;
//   }

//   Object.keys(obj).forEach((key) => {
//     // Check if any value inside the object is not undefined
//     if (Object.values(obj[key]).some((value) => value !== undefined)) {
//       // Remove properties where the value is undefined
//       const filteredValues = {};
//       Object.entries(obj[key]).forEach(([subKey, subValue]) => {
//         if (subValue !== undefined && subValue) {
//           filteredValues[subKey] = subValue;
//         }
//       });

//       // Add to filteredObj if there are filtered values
//       if (Object.keys(filteredValues).length > 0) {
//         filteredObj[key] = filteredValues;
//       }
//     }
//   });

//   return filteredObj;
// }

const SetRolePermission = ({ changePermissionId, open, closeDrawer }) => {
  const [form] = Form.useForm();

  const { data, isFetching } = useGetAllRolePermissionQuery({
    params: {
      role_id: changePermissionId,
    },
  });

  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    if (selectedRows.length) {
      selectedRows.map((item) => {
        item?.action?.map((action) => {
          const label = action?.name?.split(".")[1];

          form.setFieldsValue({
            permission: {
              [item.name]: {
                [label]: true,
              },
            },
          });
        });
      });
    } else {
      form.resetFields();
    }
  }, [form, selectedRows]);

  const changeSelectedRows = (newSelectedRows) => {
    if (selectedRows?.length > newSelectedRows.length) {
      const deleteRow = filterMissingObject(selectedRows, newSelectedRows);

      deleteRow?.action?.map((action) => {
        const label = action?.name?.split(".")[1];

        form.setFieldsValue({
          permission: {
            [deleteRow.name]: {
              [label]: undefined,
            },
          },
        });
      });
    }

    setSelectedRows(newSelectedRows);

    if (!newSelectedRows?.length) {
      form.resetFields();
    }
  };

  const dataSource =
    data?.map((item) => {
      const { module, actions } = item ?? {};

      return {
        id: module,
        name: module,
        action: actions,
      };
    }) ?? [];

  const formData = Form.useWatch("permission", form);

  function transformData(formData) {
    let transformedData = [];

    for (let key in formData) {
      let obj = {
        id: key,
        name: key,
        action: [],
      };

      let includeObject = false;

      if (formData[key]) {
        for (let actionKey in formData[key]) {
          if (formData[key][actionKey]) {
            let actionObj = {
              id: Math.floor(Math.random() * 100),
              name: `${key}.${actionKey}`,
            };
            obj.action.push(actionObj);
            includeObject = true;
          } else {
            includeObject = false;
            break;
          }
        }
      }

      if (includeObject) {
        transformedData.push(obj);
      }
    }

    return transformedData;
  }

  console.log(formData);

  const result = useMemo(() => transformData(formData), [formData]);

  useEffect(() => {
    if (result.length > 0) {
      setSelectedRows(result);
    }
  }, [result]);

  return (
    <CustomDrawer
      title={"Change Permission"}
      width={1400}
      open={open}
      onClose={closeDrawer}
      isLoading={isFetching}
    >
      <CustomForm form={form}>
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
          debounce={debounce}
          changeSelectedRows={changeSelectedRows}
          tableStyleProps={{
            scroll: {
              y: "73vh",
            },
          }}
        />
      </CustomForm>
    </CustomDrawer>
  );
};

export default SetRolePermission;
