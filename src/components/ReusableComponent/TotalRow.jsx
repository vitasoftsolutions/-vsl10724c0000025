import { Col, Row } from "antd";
import { fullColLayout } from "../../layout/FormLayout";

export const TotalRow = ({
  totalItems,
  totalQty,
  totalPrice,
  taxRate,
  discount,
  shippingCost,
  grandTotal,
}) => {
  let options = [
    { label: "Items", value: `${totalItems} (${totalQty})` },
    { label: "Total", value: totalPrice },
  ];

  if (taxRate?.toString()) {
    options.push({ label: "Tax", value: taxRate });
  }

  if (discount?.toString()) {
    options.push({ label: "Discount", value: discount });
  }

  if (shippingCost?.toString()) {
    options.push({ label: "Shipping Cost", value: shippingCost });
  }

  options = [...options, { label: "Grand Total", value: grandTotal }];

  return (
    <Row className="pb-20">
      <Col {...fullColLayout}>
        <Row className="rounded-md overflow-hidden">
          {options.map(({ label, value }) => (
            <Col
              span={24 / options.length}
              className="border flex justify-between items-center px-2 py-5 text-sm lg:text-base"
              key={label}
            >
              <span className="font-semibold">{label}</span>
              <span>
                {typeof value === "string"
                  ? value
                  : Number(value ?? 0)?.toFixed(2)}
              </span>
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
};
