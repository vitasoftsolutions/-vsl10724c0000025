import { Form, Image, Upload } from "antd";
import { useState } from "react";
import { BiImageAdd } from "react-icons/bi";
import { GlobalUtilityStyle } from "../../../container/Styled";
import ImgCrop from "antd-img-crop";

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

const CustomImageCrop = ({
  name,
  label,
  required = false,
  multiple = false,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

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

  //console.log(fileList);

  return (
    <GlobalUtilityStyle>
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
        label={<span className="font-bold mt-2">{label}</span>}
        name={name}
        rules={[{ required: required, message: `Please input ${label}!` }]}
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <ImgCrop
          showGrid
          rotationSlider
          aspectSlider
          showReset
          // onVisibleChange
          // onModalOk={(s) => {
          //   //console.log(s);
          // }}
          // onModalCancel={(s) => {
          //   //console.log(s);
          // }}
        >
          <Upload
            listType="picture-card"
            name={"file"}
            fileList={fileList}
            onChange={handleFileChange}
            onPreview={handlePreview}
            beforeUpload={(file, s) => {
              //console.log(file);
              //console.log(s);
              setFileList([...fileList, file]);
              return false;
            }}
            multiple={multiple}
            maxCount={multiple ? 20 : 1}
            className={` ${
              multiple
                ? "custom-upload border border-gray-400 rounded-md pt-2 pl-2 pr-2 pb-2"
                : "custom-single-upload"
            } mt-2`}
          >
            {(fileList.length < 1 || multiple) && (
              <button
                style={{
                  border: 0,
                  background: "none",
                }}
                type="button"
                className="w-full flex flex-col items-center justify-center"
              >
                <BiImageAdd
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
        </ImgCrop>
      </Form.Item>
    </GlobalUtilityStyle>
  );
};

export default CustomImageCrop;
