import { UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Col,
  Form,
  Modal,
  Popover,
  Row,
  theme,
} from "antd";
import { useEffect, useState } from "react";
import { FaBell, FaCashRegister } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { MdPointOfSale } from "react-icons/md";
import { RiErrorWarningFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { GlobalUtilityStyle } from "../../../container/Styled";
import { fullColLayout, rowLayout } from "../../../layout/FormLayout";
import { logout, useCurrentUser } from "../../../redux/services/auth/authSlice";
import {
  useCheckPettyCashQuery,
  useCreatePettyCashMutation,
  useUpdatePettyCashMutation,
} from "../../../redux/services/pettycash/pettyCashApi";
import {
  clearPettyCash,
  setPettyCash,
} from "../../../redux/services/pettycash/pettyCashSlice";
import { openNotification } from "../../../utilities/lib/openToaster";
import CustomInput from "../../Shared/Input/CustomInput";

const PettyCashOpenComponent = ({ navigate, open, setOpen }) => {
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const [errorFields, setErrorFields] = useState([]);

  const { pettyCashId } = useSelector((state) => state.pettyCash);

  const [createPettyCash, { isLoading }] = useCreatePettyCashMutation();

  const [updatePettyCash, { isLoading: isUpdating }] =
    useUpdatePettyCashMutation();

  const user = useSelector(useCurrentUser);

  const handleSubmit = async (values) => {
    if (pettyCashId) {
      const { data, error } = await updatePettyCash({
        id: pettyCashId,
        data: {
          warehouse_id: user?.warehouse_id,
          status: "Open",
          _method: "PUT",
        },
      });

      if (data?.success) {
        dispatch(setPettyCash({ status: "Open", id: data?.data?.id }));
        hideModal();
        form.resetFields();
        navigate("/pos");
      }

      if (error) {
        const errorFields = Object.keys(error?.data?.errors).map(
          (fieldName) => ({
            name: fieldName,
            errors: error?.data?.errors[fieldName],
          })
        );
        setErrorFields(errorFields);
      }
    } else {
      const { data, error } = await createPettyCash({
        data: { ...values, warehouse_id: user?.warehouse_id, status: "Open" },
      });

      if (data?.success) {
        dispatch(setPettyCash({ status: "Open", id: data?.data?.id }));
        hideModal();
        form.resetFields();
        navigate("/pos");
      }

      if (error) {
        const errorFields = Object.keys(error?.data?.errors).map(
          (fieldName) => ({
            name: fieldName,
            errors: error?.data?.errors[fieldName],
          })
        );
        setErrorFields(errorFields);
      }
    }
  };

  const hideModal = () => {
    setOpen(false);
    form.resetFields();
  };

  if (!open) {
    return null;
  }

  return (
    <Modal
      width={600}
      centered
      title={"Cash Register Open"}
      open={open}
      onCancel={hideModal}
      footer={null}
    >
      <Form
        fields={errorFields}
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        scrollToFirstError
      >
        <Row {...rowLayout} className="mt-5">
          <Col {...fullColLayout}>
            <CustomInput
              label="Opening Balance"
              type="number"
              name="opening_balance"
              required={true}
            />
          </Col>
        </Row>
        <div className={`w-full flex gap-3 justify-end items-center pt-5`}>
          <Button type="default" onClick={hideModal}>
            Cancel
          </Button>
          <Button
            htmlType="submit"
            type="primary"
            loading={isLoading || isUpdating}
          >
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

const PosComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pettyCash } = useSelector((state) => state.pettyCash);
  const user = useSelector(useCurrentUser);

  const { data: pettyCashData } = useCheckPettyCashQuery(
    {
      params: {
        warehouse_id: parseInt(user?.warehouse_id),
      },
    },
    {
      skip: !user?.warehouse_id,
    }
  );

  useEffect(() => {
    if (pettyCashData?.data) {
      if (pettyCashData?.data?.status === "Open") {
        console.log("first");
        dispatch(setPettyCash({ status: "Open", id: pettyCashData?.data?.id }));
      } else if (
        pettyCashData?.data?.status === "Close" &&
        !pettyCashData?.data?.id
      ) {
        dispatch(setPettyCash({ status: "Close", id: undefined }));
      } else {
        dispatch(clearPettyCash());
      }
    }
  }, [pettyCashData?.data, dispatch, pettyCash?.data?.status]);

  const [open, setOpen] = useState(false);

  const posRegister = () => {
    if (pettyCash === "Close") {
      setOpen(true);
    } else navigate("/pos");
  };

  return (
    <GlobalUtilityStyle>
      <Button
        icon={<MdPointOfSale size={18} />}
        className="flex justify-center items-center gap-1 shadow-sm"
        onClick={posRegister}
      >
        POS
      </Button>

      <PettyCashOpenComponent
        navigate={navigate}
        open={open}
        setOpen={setOpen}
      />
    </GlobalUtilityStyle>
  );
};

const CloseCashRegister = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { token } = theme.useToken();
  const { pathname } = location;

  const [updatePettyCash, { isLoading }] = useUpdatePettyCashMutation();

  const [open, setOpen] = useState(false);

  const { pettyCashId } = useSelector((state) => state.pettyCash);

  const handleCashRegister = () => {
    if (pathname.includes("/pos")) {
      setOpen(true);
      return;
    }

    navigate("/petty-cash");
  };

  const user = useSelector(useCurrentUser);

  const closeCashRegister = async () => {
    const { data } = await updatePettyCash({
      id: pettyCashId,
      data: {
        warehouse_id: user?.warehouse_id,
        status: "Close",
        _method: "PUT",
      },
    });

    if (data?.success) {
      dispatch(clearPettyCash());

      hideModal();
      navigate("/dashboard");
    }
  };

  const hideModal = () => {
    setOpen(false);
  };

  return (
    <>
      <div
        onClick={handleCashRegister}
        className="flex justify-center items-center"
      >
        <FaCashRegister
          size={24}
          style={{
            color: token.colorPrimary,
          }}
          className="hover:cursor-pointer hover:shadow-lg"
        />
      </div>

      <Modal
        title={
          <div className="flex items-center gap-3">
            <RiErrorWarningFill
              style={{
                color: "red",
                fontSize: "20px",
              }}
            />
            <span>Close Cash Register</span>
          </div>
        }
        width={600}
        centered
        open={open}
        onCancel={hideModal}
        footer={null}
      >
        <GlobalUtilityStyle>
          <span className="text-[16px]">
            {" "}
            Are you sure you want to close cash register?
          </span>
          <div className={`w-full flex gap-3 justify-end items-center pt-5`}>
            <Button
              htmlType="button"
              onClick={closeCashRegister}
              type="primary"
              loading={isLoading}
            >
              Close
            </Button>
          </div>
        </GlobalUtilityStyle>
      </Modal>
    </>
  );
};

const NotificationComponent = () => {
  const [show, setShow] = useState(true);
  const { token } = theme.useToken();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // const user = useSelector(useCurrentUser);

  // const { data } = useGetAllNotificationQuery(
  //   {
  //     params: { warehouse_id: user?.warehouse_id },
  //   },
  //   { skip: !user?.warehouse_id }
  // );

  // console.log(data);

  const handleNotification = () => {
    setIsPopoverOpen(true);
  };

  const onClose = () => {
    setShow(false);
    setIsPopoverOpen(false);
  };

  return (
    <Popover
      // content={FilterContentForm}
      title={<div className="text-start text-xl font-bold">Notifications</div>}
      trigger="click"
      placement="bottomRight"
      overlayClassName="rounded-md shadow-xl "
      overlayStyle={{ width: 300 }}
      overlayInnerStyle={{
        maxHeight: "85vh",
        overflowY: "auto",
      }}
      onOpenChange={onClose}
      open={isPopoverOpen}
      arrow={false}
    >
      <div
        onClick={handleNotification}
        className="flex justify-center items-center"
      >
        <Badge dot={show}>
          <FaBell
            size={24}
            style={{
              color: token.colorPrimary,
            }}
            className="hover:cursor-pointer "
          />
        </Badge>
      </div>
    </Popover>
  );
};

const Profile = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const { pathname } = location;

  const handleLogout = () => {
    openNotification("success", "Logged out successfully!");
    dispatch(logout());
  };

  const user = useSelector(useCurrentUser);

  const { token } = theme.useToken();
  const navigate = useNavigate();

  const content = (
    <div>
      <div className="">
        <div className="py-3 rounded-md px-2">
          <div className="flex gap-4 items-center text-lg">
            <Avatar
              className="avatar-bg shadow-md hover:shadow-lg"
              size={44}
              icon={<UserOutlined />}
            />
            <div className="flex flex-col font-normal">
              <span className="font-bold">{user?.employees?.name}</span>
              <span
                className={`text-sm `}
                style={{
                  color: token.colorPrimary,
                }}
              >
                {user?.employees?.email}
              </span>
            </div>
          </div>
        </div>

        <div className="py-2 px-4 bg-[#F5F5F5] rounded-md">
          <div
            className="flex gap-2 items-center text-lg  hover:underline profile-ul w-max"
            onClick={() => navigate("/settings/general-settings")}
          >
            <IoSettingsOutline size={18} />
            <div className="flex flex-col font-semibold text-[15px]">
              <span className="">General Settings</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full justify-end pt-3">
        <Button onClick={handleLogout} className={`w-full`} size="large">
          Log Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className=" flex justify-center items-center gap-5">
      {/* <CreateComponent /> */}
      {!pathname.includes("/pos") && (
        <>
          <PosComponent />
        </>
      )}

      <CloseCashRegister />

      <NotificationComponent />
      <Popover
        placement="bottomLeft"
        content={content}
        className="hover:cursor-pointer"
        trigger={"click"}
        overlayStyle={{ width: "auto" }}
        overlayInnerStyle={{
          width: 280,
          // backgroundColor: "#F5F5F5",
        }}
      >
        <Avatar
          className="avatar-bg shadow-md hover:shadow-lg"
          size={40}
          icon={<UserOutlined />}
        />
      </Popover>
    </div>
  );
};

export default Profile;
