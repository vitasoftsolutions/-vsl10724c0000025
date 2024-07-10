/* eslint-disable no-unused-vars */
import { Form } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { GlobalUtilityStyle } from "../../../container/Styled";

const RichTextEditor = ({ value, onChange, name, required, label }) => {
  // const handleChange = (content, delta, source, editor) => {
  //   // onChange(content);
  //   //console.log(content);
  // };

  return (
    <GlobalUtilityStyle>
      <Form.Item
        label={label}
        name={name}
        rules={[{ required: required, message: `Please input ${label}!` }]}
      >
        <ReactQuill
          theme="snow"
          // value={value}
          // onChange={handleChange}
          modules={{
            toolbar: [
              [{ header: [1, 2, 3, 4, false] }],
              ["bold", "italic", "underline", "strike", "blockquote"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image"],
              ["clean"],
            ],
          }}
          placeholder="Write something..."
          style={{ height: "200px" }}
          className="mb-10"
        />
      </Form.Item>
    </GlobalUtilityStyle>
  );
};

export default RichTextEditor;
