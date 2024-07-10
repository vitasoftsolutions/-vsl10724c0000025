import { Button, Modal } from "antd";
import { FaInfoCircle } from "react-icons/fa";
import { GlobalUtilityStyle } from "../../../container/Styled";

const props = {
  footer: null,
  centered: true,
  maskClosable: true,
};

const StatusModal = ({
  text,
  statusModal,
  hideModal,
  handleStatus,
  isLoading,
}) => {
  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <FaInfoCircle
            style={{
              fontSize: "20px",
            }}
          />
          <span>Status Update</span>
        </div>
      }
      open={statusModal}
      onCancel={hideModal}
      {...props}
    >
      <GlobalUtilityStyle>
        <span>{text ?? "Do you want to update your status?"}</span>
        <div className="w-full flex justify-end items-center gap-3">
          <Button onClick={hideModal}>No</Button>
          <Button type="primary" onClick={handleStatus} loading={isLoading}>
            Yes
          </Button>
        </div>
      </GlobalUtilityStyle>
    </Modal>
  );
};

export default StatusModal;
