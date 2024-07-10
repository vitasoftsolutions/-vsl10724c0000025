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
import { useState } from "react";
import { FaCashRegister } from "react-icons/fa";
import { GoBell } from "react-icons/go";
import { MdPointOfSale } from "react-icons/md";
import { RiErrorWarningFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { GlobalUtilityStyle } from "../../../container/Styled";
import { fullColLayout, rowLayout } from "../../../layout/FormLayout";
import { logout, useCurrentUser } from "../../../redux/services/auth/authSlice";
import { useCreatePettyCashMutation } from "../../../redux/services/pettycash/pettyCashApi";
import { setPettyCash } from "../../../redux/services/pettycash/pettyCashSlice";
import { openNotification } from "../../../utilities/lib/openToaster";
import CustomInput from "../../Shared/Input/CustomInput";

const PettyCashOpenComponent = ({ navigate, open, setOpen }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [errorFields, setErrorFields] = useState([]);

  const [createPettyCash, { isLoading }] = useCreatePettyCashMutation();

  const user = useSelector(useCurrentUser);

  const handleSubmit = async (values) => {
    const { data, error } = await createPettyCash({
      data: { ...values, warehouse_id: user?.warehouse_id, status: "Open" },
    });

    if (data?.success) {
      dispatch(setPettyCash("Open"));
      hideModal();
      form.resetFields();
      navigate("/pos");
    }

    if (error) {
      const errorFields = Object.keys(error?.data?.errors).map((fieldName) => ({
        name: fieldName,
        errors: error?.data?.errors[fieldName],
      }));
      setErrorFields(errorFields);
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
          <Button htmlType="submit" type="primary" loading={isLoading}>
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

const PosComponent = () => {
  const navigate = useNavigate();
  const { pettyCash } = useSelector((state) => state.pettyCash);

  // console.log(pettyCash);

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
        className="flex justify-center items-center gap-1 shadow-md"
        // size="large"
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

const CashRegisterComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { pathname } = location;

  const [createPettyCash, { isLoading }] = useCreatePettyCashMutation();

  const [open, setOpen] = useState(false);

  const handleCashRegister = () => {
    if (pathname.includes("/pos")) {
      setOpen(true);
      return;
    }

    navigate("/petty-cash");
  };

  const user = useSelector(useCurrentUser);

  const closeCashRegister = async () => {
    const { data } = await createPettyCash({
      data: { warehouse_id: user?.warehouse_id, status: "Close" },
    });

    if (data?.success) {
      dispatch(setPettyCash("Close"));

      hideModal();
      navigate("/dashboard");
    }
  };

  const hideModal = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        icon={<FaCashRegister size={18} />}
        className="flex justify-center items-center gap-1 shadow-md"
        onClick={handleCashRegister}
      />

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
        backgroundColor: "#F8FAFC",
        maxHeight: "85vh",
        overflowY: "auto",
      }}
      onOpenChange={onClose}
      open={isPopoverOpen}
      arrow={false}
    >
      <Button className="rounded-md shadow-md" onClick={handleNotification}>
        <Badge dot={show}>
          <GoBell
            size={20}
            style={{
              color: token.colorPrimary,
            }}
            className="hover:cursor-pointer"
          />
        </Badge>
      </Button>
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

  const content = (
    <div className="space-y-5 ">
      <div className="p-3 bg-[#F5F5F5]  rounded-md">
        <div className="flex gap-3 items-center text-lg">
          <Avatar
            className="avatar-bg shadow-md hover:shadow-lg"
            size={40}
            icon={<UserOutlined />}
          />
          <div className="flex flex-col font-semibold">
            <span>{user?.employees?.name}</span>
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
      {/* <hr className="my-2" />
      <div className="text-lg">User Profile</div>
      <hr className="my-2" /> */}
      <div className="flex w-full justify-end">
        <Button onClick={handleLogout} className={`w-full `}>
          Log Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className=" flex justify-center items-center gap-3">
      {/* <CreateComponent /> */}
      {!pathname.includes("/pos") && (
        <>
          <PosComponent />
        </>
      )}

      <CashRegisterComponent />

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
    // <div></div>
  );
};

export default Profile;
