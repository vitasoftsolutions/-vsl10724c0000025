import { useEffect, useState } from "react";
import { GlobalUtilityStyle } from "../../../container/Styled";
import { Col, Form, Image, Row, Upload } from "antd";
import { LiaCloudUploadAltSolid } from "react-icons/lia";

const rowLayout = {
  gutter: 25,
  align: "middle",
  justify: "start",
};

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const CustomLogoUploader = ({ name }) => {
  const form = Form.useFormInstance();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    handleFileChange({ fileList: [form?.getFieldValue("logo")] });
  }, [form]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // //console.log(fileList);

  return (
    <GlobalUtilityStyle>
      <Row {...rowLayout} className="">
        <Col xs={24} className="flex flex-col items-center justify-center">
          {previewImage && (
            <Image
              wrapperStyle={{
                display: "none",
              }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
          <Form.Item
            name={name}
            valuePropName="fileList"
            getValueFromEvent={normFile}
            className=""
            style={{
              marginBottom: 0,
            }}
          >
            <Upload
              listType="picture-circle"
              name={"file"}
              fileList={fileList}
              onChange={handleFileChange}
              onPreview={handlePreview}
              beforeUpload={(file) => {
                setFileList([...fileList, file]);
                return false;
              }}
              maxCount={1}
              className="custom-logo-upload"
            >
              {fileList?.length === 0 && (
                <button
                  style={{
                    // border: 0,
                    background: "none",
                  }}
                  type="button"
                  className="w-full flex flex-col items-center justify-center avatar-uploader "
                >
                  <LiaCloudUploadAltSolid
                    style={{
                      fontSize: 25,
                    }}
                  />
                  <div
                    style={{
                      marginTop: 8,
                    }}
                  >
                    Upload
                  </div>
                </button>
              )}
            </Upload>
          </Form.Item>
          <div className="text-center text-md md:text-xl pb-5">Logo</div>
        </Col>
      </Row>
    </GlobalUtilityStyle>
  );
};

export default CustomLogoUploader;
