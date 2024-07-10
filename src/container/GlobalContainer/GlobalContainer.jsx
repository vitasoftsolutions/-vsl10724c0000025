import { PageContainer } from "@ant-design/pro-layout";
import {
  Button,
  Checkbox,
  Col,
  Dropdown,
  Form,
  Input,
  Popover,
  Row,
  Space,
} from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaUpload } from "react-icons/fa";
import {
  FaCirclePlus,
  FaEllipsis,
  FaEye,
  FaPrint,
  FaTrash,
} from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { TbFilterSearch } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { FilterDateRange } from "../../components/ReusableComponent/FilterDateRange";
import CustomForm from "../../components/Shared/Form/CustomForm";
import DeleteModal from "../../components/Shared/Modal/DeleteModal";
import { fullColLayout, rowLayout } from "../../layout/FormLayout";
import { useCurrentToken } from "../../redux/services/auth/authSlice";
import { useBulkDeleteMutation } from "../../redux/services/deleteApi";
import { openCreateDrawer } from "../../redux/services/drawer/drawerSlice";
import { setLoading } from "../../redux/services/loader/loaderSlice";
import { base_url } from "../../utilities/configs/base_url";
import { appendToFormData } from "../../utilities/lib/appendFormData";
import { downloadFile } from "../../utilities/lib/downloadFile";
import { usePermission } from "../../utilities/lib/getPermission";
import { GlobalUtilityStyle } from "../Styled";
import ImportModal from "../../components/Shared/Modal/ImportModal";

const GlobalContainer = ({
  pageTitle,
  columns = [],
  selectedRows,
  setSelectedRows,
  children,
  setNewColumns,
  searchFilterContent,
  api,
  debounce,
  setParams,
  popoverWidth = 600,
  // handleSeach
}) => {
  const dispatch = useDispatch();
  const token = useSelector(useCurrentToken);
  const { pathname } = useLocation();

  const [open, setOpen] = useState(false);
  const [checkedMenuOpen, setCheckedMenuOpen] = useState(false);

  const [deleteModal, setDeleteModal] = useState(false);
  const [bulkDelete, { isLoading }] = useBulkDeleteMutation();

  const defaultCheckedList = useMemo(
    () => columns.map((item) => item.key),
    [columns]
  );

  const [checkedList, setCheckedList] = useState(defaultCheckedList);

  const handleDrawerOpen = () => {
    dispatch(openCreateDrawer());
  };

  const header = {
    title: <div className="text-2xl lg:text-3xl py-3">{pageTitle}</div>,
    subTitle: usePermission(api, "store") &&
      !["/petty-cash", "/reports"].some((path) => pathname.includes(path)) && (
        <div className="w-full">
          <Button
            key={"create"}
            type="text"
            icon={<FaCirclePlus size={28} />}
            style={{ width: "45px", height: "100%" }}
            onClick={handleDrawerOpen}
            className="primary-text flex justify-center items-center"
          />
        </div>
      ),
  };

  const handleMenuClick = (e) => {
    if (e.key !== "tableColumns") {
      setCheckedMenuOpen(false);
    }
  };

  const onChange = (list) => {
    setCheckedList(list);
  };

  const handleOpenChange = (nextOpen, info) => {
    console.log(nextOpen, info);
    if (info.source === "trigger" || nextOpen) {
      setOpen(nextOpen);
    }

    // setOpen(nextOpen);
  };

  const handleCheckedOpenChange = (nextOpen, info) => {
    if (info.source === "trigger" || nextOpen) {
      setCheckedMenuOpen(nextOpen);
    }
  };

  const menu = {
    onClick: handleMenuClick,
    className: "-translate-x-[34px] translate-y-1/4",
    items: [
      {
        key: "tableColumns",
        label: (
          <Checkbox.Group
            className="flex flex-col"
            options={columns.map(({ key, title }) => ({
              label: title,
              value: key,
            }))}
            value={checkedList}
            onChange={onChange}
          />
        ),
      },
    ],
  };

  const [importModal, setImportModal] = useState(false);

  const handleImport = () => {
    setImportModal(true);
  };

  console.log(importModal);

  const items = [
    setNewColumns && {
      key: "view",
      label: (
        <Dropdown
          open={checkedMenuOpen}
          onOpenChange={handleCheckedOpenChange}
          key="dropdown"
          menu={menu}
          placement="left"
        >
          <div>View</div>
        </Dropdown>
      ),
      icon: <FaEye size={16} />,
    },
    usePermission(api, "import") && {
      label: "Import",
      key: "import",
      onClick: handleImport,
      icon: <FaUpload size={16} />,
    },
    usePermission(api, "export") && {
      label: "PDF",
      key: "pdf",
      onClick: () => handleExport("pdf"),
      icon: <FaFilePdf size={16} />,
    },
    usePermission(api, "export") && {
      label: "Excel",
      key: "excel",
      onClick: () => handleExport("xlsx"),
      icon: <FaFileExcel size={16} />,
    },
    usePermission(api, "export") && {
      label: "CSV",
      key: "csv",
      onClick: () => handleExport("csv"),
      icon: <FaFileCsv size={16} />,
    },
    {
      label: "Print",
      key: "print",
      icon: <FaPrint size={16} />,
    },
  ];

  // const [loading, setLoading] = useState(false);

  const handleExport = useCallback(
    async (format) => {
      // setLoading(true);
      dispatch(setLoading(true));

      const fileUrl = new URL(`${base_url}/${api}/export`);
      const supportedFormats = {
        xlsx: "xlsx",
        pdf: "pdf",
        csv: "csv",
      };

      if (!supportedFormats[format]) {
        console.error("Unsupported file format");
        return;
      }

      fileUrl.searchParams.append("format", format);

      try {
        const response = await fetch(fileUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to download file");
        }

        await downloadFile(response, supportedFormats[format], pageTitle);
      } catch (error) {
        console.error("Error:", error);
        dispatch(setLoading(false));
      } finally {
        dispatch(setLoading(false));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [api, token]
  );

  const handleDeleteModal = () => {
    // dispatch(openDeleteDrawer());
    setDeleteModal(true);
  };

  const handleBulkDelete = async () => {
    const formData = new FormData();
    const deleted_ids = selectedRows.map((item) => item.id);

    const postData = { deleted_ids };

    // formData.append("delete_ids", delete_ids);
    appendToFormData(postData, formData);

    const { data, error } = await bulkDelete({
      url: api,
      data: postData,
    });

    if (data?.success) {
      hideModal();
      setSelectedRows([]);
    } else {
      console.log(error);
    }

    console.log(data, error);
  };

  const hideModal = () => {
    setDeleteModal(false);
    setImportModal(false);
  };

  useEffect(() => {
    if (setNewColumns) {
      const newColumns = columns.map((item) => ({
        ...item,
        hidden: !checkedList.includes(item.key),
      }));
      setNewColumns(newColumns);
    }
  }, [checkedList, columns, setNewColumns]);

  const [searchForm] = Form.useForm();
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handlePopoverOpen = () => {
    setPopoverOpen(true);
  };

  const handlePopoverClose = () => {
    setPopoverOpen(false);
  };

  const [advanceSearch, setAdvanceSearch] = useState(false);

  const handleReset = () => {
    searchForm.resetFields();
    setParams({});
    setAdvanceSearch(false);
  };

  const handleSubmit = async (values) => {
    const { searchDate, ...rest } = values;

    if (searchDate) {
      setAdvanceSearch(true);
    }

    const postData = {};
    Object.keys(rest).forEach((key) => {
      if (rest?.[key]?.length) {
        setAdvanceSearch(true);
        postData[key] = rest[key];
      }
    });

    if (searchDate) {
      postData.created_daterange = [
        searchDate?.[0].format("YYYY-MM-DD"),
        searchDate?.[1].format("YYYY-MM-DD"),
      ];
    }

    setParams(postData);

    handlePopoverClose();
  };

  const FilterContentForm = (
    <CustomForm
      form={searchForm}
      handleSubmit={handleSubmit}
      submitBtn={false}
      layout="vertical"
    >
      <Row {...rowLayout}>
        <Col {...fullColLayout}>
          <FilterDateRange />
        </Col>
      </Row>

      <div
        style={{
          maxHeight: 300,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "0 10px",
        }}
      >
        {searchFilterContent}
      </div>

      <div className={`w-full flex gap-3 justify-end items-center pt-5 pb-3`}>
        <Button type="default" onClick={handlePopoverClose}>
          Cancel
        </Button>
        <Button type="default" onClick={handleReset}>
          Reset
        </Button>
        <Button
          htmlType="submit"
          type="primary"

          // loading={loading}
        >
          Search
        </Button>
      </div>
    </CustomForm>
  );

  return (
    <GlobalUtilityStyle>
      <div className="h-full">
        <PageContainer
          header={header}
          extra={[
            <Space key="search">
              <Space.Compact>
                <Input
                  type="text"
                  key="search"
                  size="large"
                  className="w-full border rounded-md border-gray-300 focus:outline-none focus:border-primary"
                  placeholder="Search"
                  prefix={
                    <IoSearch
                      style={{ fontSize: "16px" }}
                      className="primary-text hover:cursor-pointer hover:scale-110 duration-300 text-xs lg:text-[16px]"
                    />
                  }
                  onChange={(e) => debounce(e.target.value)}
                  allowClear={true}
                />
                <Popover
                  content={FilterContentForm}
                  title={<div className="text-center">Advance Search</div>}
                  trigger="click"
                  placement="bottomRight"
                  // className="border border-slate-500 rounded-md"
                  overlayClassName="rounded-md shadow-xl"
                  overlayStyle={{ width: popoverWidth }}
                  overlayInnerStyle={{
                    backgroundColor: "",
                  }}
                  onOpenChange={handlePopoverClose}
                  open={popoverOpen}
                  arrow={false}
                >
                  <Button
                    key="filter"
                    size="large"
                    className="border border-gray-300"
                    type="text"
                    onClick={handlePopoverOpen}
                  >
                    <TbFilterSearch
                      style={{ fontSize: "16px" }}
                      className="text-xs primary-text lg:text-[16px]"
                    />
                  </Button>
                  {/* <CustomModal
                  title="Advance Search"
                  openModal={popoverOpen}
                  hideModal={handlePopoverClose}
                  showCloseButton={false}
                  width={800}
                >
                  {FilterContentForm}
                </CustomModal> */}
                </Popover>
              </Space.Compact>
            </Space>,
            <Space key="dropdown">
              <Dropdown
                trigger={["click"]}
                open={open}
                onOpenChange={handleOpenChange}
                menu={{
                  items,
                  selectable: true,
                  onSelect: (value) => value.key !== "view" && setOpen(false),
                }}
                placement="bottom"
              >
                <Button
                  style={{ padding: "0px 12px" }}
                  size="large"
                  className="flex justify-center items-center"
                >
                  <FaEllipsis size={20} />
                </Button>
              </Dropdown>
            </Space>,
            <Space key={"delete"}>
              {selectedRows?.length > 0 && (
                <div>
                  <button
                    className="custom-primary-btn p-2 rounded-xl text-white duration-300"
                    size="large"
                    onClick={handleDeleteModal}
                  >
                    <FaTrash size={20} />
                  </button>
                </div>
              )}
            </Space>,
          ]}
          content={
            <div>
              {
                <Space
                  key={"extra"}
                  className="w-full flex justify-end items-center pb-3 gap-2 underline  font-semibold"
                >
                  <span>{`Showing ${
                    advanceSearch ? "Filtered" : "All"
                  }  Results`}</span>

                  {advanceSearch && (
                    <span
                      onClick={handleReset}
                      className="primary-text hover:cursor-pointer hover:underline"
                    >
                      (Reset)
                    </span>
                  )}
                </Space>
              }
              {children}
            </div>
          }
        />
      </div>

      <DeleteModal
        deleteModal={deleteModal}
        hideModal={hideModal}
        isLoading={isLoading}
        handleDelete={handleBulkDelete}
        item={"items"}
      />

      <ImportModal importModal={importModal} hideModal={hideModal} />
    </GlobalUtilityStyle>
  );
};

export default GlobalContainer;
