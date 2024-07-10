import { Button } from "antd";

const CustomButton = ({ isLoading = false, btnContent }) => {
  return (
    <Button
      key={btnContent}
      htmlType="submit"
      loading={isLoading}
      className="font-bold w-full pt-2 pb-8 bg-secondary hover:bg-posPurple"
      type="primary"
    >
      {btnContent}
    </Button>
  );
};

export default CustomButton;
