import { Col, Form } from "antd";
import { useEffect } from "react";
import {
  colLayout,
  fullColLayout,
  mdColLayout,
} from "../../../layout/FormLayout";
import { useGetAllGiftCardQuery } from "../../../redux/services/giftcard/giftcard/giftCardApi";
import CustomInput from "../../Shared/Input/CustomInput";
import CustomSelect from "../../Shared/Select/CustomSelect";

const PaymentType = () => {
  const form = Form.useFormInstance();

  useEffect(() => {
    form.setFieldValue("payment_type", "Cash");
  }, [form]);

  const options = [
    {
      value: "Cash",
      label: "Cash",
    },
    {
      value: "Gift Card",
      label: "Gift Card",
    },
    {
      value: "Card",
      label: "Card",
    },
    {
      value: "Cheque",
      label: "Cheque",
    },
    // {
    //   value: "Points",
    //   label: "Points",
    // },
  ];

  return (
    <CustomSelect
      label="Payment Type"
      options={options}
      name={"payment_type"}
    />
  );
};

const GiftCardComponent = () => {
  const { data, isFetching } = useGetAllGiftCardQuery({});

  const options = data?.results?.giftcard?.map((item) => {
    return {
      value: item.id.toString(),
      label: item.card_no,
    };
  });

  //console.log(data);

  return (
    <Col {...fullColLayout}>
      <CustomSelect
        isLoading={isFetching}
        options={options}
        name="gift_card_id"
        label="Gift Card Number"
        required={true}
      />
    </Col>
  );
};

const CardComponent = () => {
  const options = [
    {
      //master credit
      value: "Master Card (Credit)",
      label: "Master Card (Credit)",
    },
    {
      //visa credit
      value: "Visa Card (Credit)",
      label: "Visa Card (Credit)",
    },
    {
      //master debit
      value: "Master Card (Debit)",
      label: "Master Card (Debit)",
    },
    {
      //visa debit
      value: "Visa Card (Debit)",
      label: "Visa Card (Debit)",
    },
    {
      //american express
      value: "American Express",
      label: "American Express",
    },
  ];

  return (
    <>
      <Col {...mdColLayout}>
        <CustomInput
          type={"text"}
          name="issuer"
          label="Issuer Name"
          required={true}
        />
      </Col>
      <Col {...mdColLayout}>
        <CustomSelect
          options={options}
          name="card_type"
          label="Card Type"
          required={true}
        />
      </Col>
    </>
  );
};

const ChequeComponent = () => {
  return (
    <>
      <Col {...mdColLayout}>
        <CustomInput
          type={"text"}
          name="bank"
          label="Bank Name"
          required={true}
        />
      </Col>
      <Col {...mdColLayout}>
        <CustomInput
          type={"text"}
          name="cheque_no"
          label="Cheque Number"
          required={true}
        />
      </Col>
    </>
  );
};

export const PaymentTypeComponent = ({ grandTotal }) => {
  const form = Form.useFormInstance();
  const paymentStatus = Form.useWatch("payment_status", form);

  const receivedAmount = Form.useWatch("recieved_amount", form);
  const paidAmount = Form.useWatch("paid_amount", form);

  const paymentType = Form.useWatch("payment_type", form);

  useEffect(() => {
    if (paymentStatus === "Paid") {
      form.setFieldValue("paid_amount", grandTotal);
    }

    // if (paymentStatus === "Partial") {
    //   form.setFieldValue("paid_amount", receivedAmount);
    // }

    // if (paymentStatus === "Paid" && receivedAmount < grandTotal) {
    //   form.setFieldValue("recieved_amount", paidAmount);
    // }
  }, [paidAmount, form, paymentStatus, grandTotal, receivedAmount]);

  const change = Number(
    parseFloat(receivedAmount ?? 0) - parseFloat(paidAmount ?? 0)
  ).toFixed(2);

  return (
    (paymentStatus === "Paid" || paymentStatus === "Partial") && (
      <>
        <Col {...colLayout}>
          <PaymentType />
        </Col>
        <Col {...colLayout}>
          <CustomInput
            type={"number"}
            name="recieved_amount"
            label="Recieved Amount"
            required={true}
          />
        </Col>

        <Col {...colLayout}>
          <CustomInput
            type={"number"}
            name="paid_amount"
            label="Paid Amount"
            required={true}
          />
        </Col>

        <Col {...colLayout}>
          <CustomInput
            type={"text"}
            name="payment_receiver"
            label="Payment Receiver"
          />
        </Col>

        {(paymentStatus === "Paid" || paymentStatus === "Partial") && (
          <Col {...mdColLayout}>
            <div className="py-9 text-lg font-semibold">Change: {change}</div>
          </Col>
        )}

        {paymentStatus === "Partial" && (
          <Col {...(paymentStatus === "Partial" ? mdColLayout : fullColLayout)}>
            <div className="py-9 text-lg font-semibold">
              Due: {Number(grandTotal - receivedAmount || 0).toFixed(2)}
            </div>
          </Col>
        )}

        {paymentType === "Gift Card" && <GiftCardComponent />}
        {paymentType === "Card" && <CardComponent />}
        {paymentType === "Cheque" && <ChequeComponent />}

        <Col {...fullColLayout}>
          <CustomInput
            type={"textarea"}
            name="payment_note"
            label="Payment Note"
          />
        </Col>
      </>
    )
  );
};
