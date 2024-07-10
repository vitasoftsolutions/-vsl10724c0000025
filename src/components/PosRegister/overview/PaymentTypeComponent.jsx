import { Button, Col, Form } from "antd";
import { useEffect } from "react";
import { BsCash } from "react-icons/bs";
import { fullColLayout, mdColLayout } from "../../../layout/FormLayout";
import { useGetAllGiftCardQuery } from "../../../redux/services/giftcard/giftcard/giftCardApi";
import CustomInput from "../../Shared/Input/CustomInput";
import CustomSelect from "../../Shared/Select/CustomSelect";
import { useSelector } from "react-redux";
import { useCurrency } from "../../../redux/services/pos/posSlice";

const PaymentType = ({ paymentType }) => {
  const form = Form.useFormInstance();
  const payment = Form.useWatch("payment_type", form);

  useEffect(() => {
    if (!payment) {
      form.setFieldValue("payment_type", "Cash");
    }
  }, [form, payment]);

  useEffect(() => {
    form.setFieldValue("payment_type", paymentType);
  }, [form, paymentType]);

  const options = [
    {
      value: "Cash",
      label: "Cash",
    },
    {
      value: "Card",
      label: "Card",
    },
    {
      value: "Cheque",
      label: "Cheque",
    },
    {
      value: "Gift Card",
      label: "Gift Card",
    },

    {
      value: "Points",
      label: "Points",
    },
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
        showSearch={true}
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
          name="card"
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

export const PaymentTypeComponent = ({
  paymentType: payment_type,
  grandTotal,
}) => {
  const form = Form.useFormInstance();

  const receivedAmount = Form.useWatch("recieved_amount", form);
  const paidAmount = Form.useWatch("paid_amount", form);
  const paymentType = Form.useWatch("payment_type", form);

  useEffect(() => {
    form.setFieldValue("paid_amount", grandTotal ?? 0);
  }, [paidAmount, receivedAmount, grandTotal, form]);

  const change = Number(
    parseFloat(receivedAmount ?? 0) - parseFloat(paidAmount ?? 0)
  ).toFixed(2);

  const handleQuickCash = (value) => {
    const paidAmount = form.getFieldValue("recieved_amount") ?? 0;
    form.setFieldValue("recieved_amount", paidAmount + value);
  };

  const currency = useSelector(useCurrency);

  return (
    <>
      {paymentType === "Cash" && (
        <>
          <span className="text-center w-full pb-5 text-lg font-semibold">
            Quick Cash
          </span>
          <Col {...fullColLayout}>
            <div className="grid grid-cols-7 gap-3 pb-5">
              <Button
                type="primary flex justify-center items-center"
                icon={<BsCash />}
                onClick={() => handleQuickCash(10)}
              >
                10
              </Button>
              <Button
                type="primary flex justify-center items-center"
                icon={<BsCash />}
                onClick={() => handleQuickCash(20)}
              >
                20
              </Button>
              <Button
                type="primary flex justify-center items-center"
                icon={<BsCash />}
                onClick={() => handleQuickCash(50)}
              >
                50
              </Button>
              <Button
                type="primary flex justify-center items-center"
                icon={<BsCash />}
                onClick={() => handleQuickCash(100)}
              >
                100
              </Button>
              <Button
                type="primary flex justify-center items-center"
                icon={<BsCash />}
                onClick={() => handleQuickCash(200)}
              >
                200
              </Button>
              <Button
                type="primary flex justify-center items-center"
                icon={<BsCash />}
                onClick={() => handleQuickCash(500)}
              >
                500
              </Button>
              <Button
                type="primary flex justify-center items-center"
                icon={<BsCash />}
                onClick={() => handleQuickCash(1000)}
              >
                1000
              </Button>
            </div>
          </Col>
        </>
      )}
      <Col {...mdColLayout}>
        <PaymentType paymentType={payment_type} />
      </Col>
      <Col {...mdColLayout}>
        <CustomInput
          type={"number_with_money"}
          suffix={currency?.name}
          name="recieved_amount"
          label="Recieved Amount"
          required={true}
        />
      </Col>
      <Col {...mdColLayout}>
        <CustomInput
          type={"number_with_money"}
          suffix={currency?.name}
          name="paid_amount"
          label="Paid Amount"
          required={true}
        />
      </Col>

      <Col {...mdColLayout}>
        <CustomInput
          type={"text"}
          name="payment_receiver"
          label="Payment Receiver"
        />
      </Col>

      <Col {...fullColLayout}>
        <div className="py-2 pb-8 text-lg font-semibold">Change: {change}</div>
      </Col>

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
  );
};
