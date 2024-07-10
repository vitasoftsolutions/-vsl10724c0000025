import { UserOutlined } from "@ant-design/icons";
import { App, Button, Dropdown } from "antd";
import { MdFormatListBulletedAdd } from "react-icons/md";

const items = [
  {
    label: "1st menu item",
    key: "1",
    icon: <UserOutlined />,
  },
  {
    label: "2nd menu item",
    key: "2",
    icon: <UserOutlined />,
  },
  {
    label: "3rd menu item",
    key: "3",
    icon: <UserOutlined />,
    danger: true,
  },
];

const CreateComponent = () => {
  const { message } = App.useApp();

  const handleMenuClick = (e) => {
    message.info("Click on menu item.");
    //console.log("click", e);
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const dropDownProps = {
    trigger: ["click"],
    placement: "bottom",
    arrow: {
      pointAtCenter: true,
    },
    menu: { ...menuProps },
  };

  return (
    <Dropdown {...dropDownProps}>
      <Button
        icon={<MdFormatListBulletedAdd size={18} />}
        className="flex justify-center items-center gap-1 shadow-md"
        // size="large"
      />
    </Dropdown>
  );
};

export default CreateComponent;
