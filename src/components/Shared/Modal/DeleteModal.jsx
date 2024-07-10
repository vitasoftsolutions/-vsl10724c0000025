import { Button, Modal } from "antd";
import { RiErrorWarningFill } from "react-icons/ri";
import { GlobalUtilityStyle } from "../../../container/Styled";

const modalProps = {
  footer: null,
  centered: true,
  maskClosable: true,
};

const DeleteModal = ({
  deleteModal,
  hideModal,
  handleDelete,
  isLoading,
  item = "item",
}) => {
  return (
    <GlobalUtilityStyle>
      <Modal
        title={
          <div className="flex items-center gap-3">
            <RiErrorWarningFill
              style={{
                color: "red",
                fontSize: "20px",
              }}
            />
            <span>Delete {item}</span>
          </div>
        }
        open={deleteModal}
        onCancel={hideModal}
        {...modalProps}
      >
        <GlobalUtilityStyle>
          <span>Do you want to delete this {item}?</span>
          <div className="w-full flex justify-end items-center gap-3">
            <Button onClick={hideModal}>No</Button>
            <Button type="primary" onClick={handleDelete} loading={isLoading}>
              Yes
            </Button>
          </div>
        </GlobalUtilityStyle>
      </Modal>
    </GlobalUtilityStyle>
  );
};

export default DeleteModal;
