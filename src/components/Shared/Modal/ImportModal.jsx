import { Button, Form, Modal, theme, Upload } from "antd";
import { FaDownload, FaUpload } from "react-icons/fa";
import { FaFileArrowUp } from "react-icons/fa6";
import { GlobalUtilityStyle } from "../../../container/Styled";
import CustomForm from "../Form/CustomForm";

const modalProps = {
  footer: null,
  centered: true,
  maskClosable: true,
};

const normFile = (e) => {
  console.log("Upload event:", e);
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const ImportModal = ({ importModal, hideModal, handleImport, isLoading }) => {
  const [importForm] = Form.useForm();

  const handleSubmit = async (values) => {
    console.log(values);
  };

  const { token } = theme.useToken();
  return (
    <GlobalUtilityStyle>
      <Modal
        title={
          <div className="flex items-center gap-3">
            <FaFileArrowUp
              style={{
                // color: "red",
                fontSize: "18px",
              }}
            />
            <span>Import File</span>
          </div>
        }
        open={importModal}
        onCancel={hideModal}
        {...modalProps}
      >
        <GlobalUtilityStyle className="pt-3">
          <CustomForm
            submitBtn={false}
            form={importForm}
            handleSubmit={handleSubmit}
          >
            <Form.Item className="">
              <Form.Item
                name="dragger"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                noStyle
              >
                <Upload.Dragger name="files" accept=".csv" multiple={false}>
                  <div className="flex w-full items-center justify-center">
                    <FaUpload
                      size={45}
                      className="mb-3"
                      style={{
                        color: token.colorPrimary,
                      }}
                    />
                  </div>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint">
                    Upload File in required Format
                  </p>
                </Upload.Dragger>
              </Form.Item>
            </Form.Item>
          </CustomForm>
          <Button
            type="primary"
            onClick={handleImport}
            loading={isLoading}
            className="w-full mb-5 flex justify-center items-center "
            icon={<FaDownload />}
          >
            Download Format
          </Button>
          <div className="w-full flex justify-end items-center gap-3">
            <Button onClick={hideModal}>Cancel</Button>
            <Button type="primary" onClick={handleImport} loading={isLoading}>
              Import
            </Button>
          </div>
        </GlobalUtilityStyle>
      </Modal>
    </GlobalUtilityStyle>
  );
};

export default ImportModal;
