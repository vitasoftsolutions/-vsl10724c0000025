import { generate, presetPalettes } from "@ant-design/colors";
import { Col, ColorPicker, Divider, Form, Row, theme } from "antd";

const rowLayout = {
  gutter: 25,
  align: "middle",
  justify: "start",
};

const colLayout = {
  xs: 12,
};

const genPresets = (presets = presetPalettes) =>
  Object.entries(presets).map(([label, colors]) => ({
    label,
    colors,
  }));

const customPrimaryPanelRender = (_, { components: { Picker, Presets } }) => (
  <div>
    <div
      style={{
        fontSize: 12,
        color: "black",
        lineHeight: "20px",
        marginBottom: 8,
        fontWeight: 500,
      }}
    >
      This is your primary color. Choose a strong color to enhance the UI. It
      will be mainly used in hover color, focus color, text color etc.
    </div>

    <Row justify="space-between" wrap={false}>
      <Col span={12}>
        <Picker />
      </Col>
      <Divider
        type="vertical"
        style={{
          height: "auto",
        }}
      />
      <Col flex="auto">
        <Presets />
      </Col>
    </Row>
  </div>
);

const customSecondaryPanelRender = (_, { components: { Picker, Presets } }) => (
  <div>
    <div
      style={{
        fontSize: 12,
        color: "black",
        lineHeight: "20px",
        marginBottom: 8,
        fontWeight: 500,
      }}
    >
      This is your accent color. Choose a mild color to enhance the Primary
      Color. It will be mainly used in general color, background color etc.
    </div>

    <Row justify="space-between" wrap={false}>
      <Col span={12}>
        <Picker />
      </Col>
      <Divider
        type="vertical"
        style={{
          height: "auto",
        }}
      />
      <Col flex="auto">
        <Presets />
      </Col>
    </Row>
  </div>
);

const ColorSettingComponent = () => {
  // const dispatch = useDispatch();
  const { token } = theme.useToken();

  const presets = genPresets({
    Primary: generate(token.colorPrimary),
    Secondary: generate(token.secondaryColor),
  });

  return (
    <>
      <Divider orientation="left" orientationMargin={0}>
        Color Settings
      </Divider>
      <Row {...rowLayout} className="">
        <Col {...colLayout}>
          <Form.Item
            label="Primary Color"
            name={"primary_color"}
            initialValue={token.colorPrimary}
          >
            <ColorPicker
              styles={{
                popupOverlayInner: {
                  width: 480,
                },
              }}
              presets={presets}
              panelRender={customPrimaryPanelRender}
              size="large"
              showText={(color) => <span>{color.toHexString()}</span>}
              format="hex"
            />
          </Form.Item>
        </Col>
        <Col {...colLayout}>
          <Form.Item
            label="Secondary Color"
            name={"secendary_color"}
            initialValue={token.secondaryColor}
          >
            <ColorPicker
              styles={{
                popupOverlayInner: {
                  width: 480,
                },
              }}
              presets={presets}
              panelRender={customSecondaryPanelRender}
              size="large"
              showText={(color) => <span>{color.toHexString()}</span>}
              format="hex"
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default ColorSettingComponent;
