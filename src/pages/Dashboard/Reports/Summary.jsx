import { Form, Table } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ReportContainer } from "../../../container/ReportContainer/ReportContainer";
import { useCurrentUser } from "../../../redux/services/auth/authSlice";
import { useCurrency } from "../../../redux/services/pos/posSlice";
import { useGetReportSummaryQuery } from "../../../redux/services/reports/summaryApi";
import { showCurrency } from "../../../utilities/lib/currency";
import { getLastWeek } from "../../../utilities/lib/getLastWeek";
// const { Text } = Typography;

const styleProps = {
  // summary: () => {
  //   return (
  //     <Table.Summary fixed="bottom">
  //       <Table.Summary.Row>
  //         <Table.Summary.Cell index={1} colSpan={3}>
  //           <Text className="font-bold" type="">
  //             Total Purchase
  //           </Text>
  //         </Table.Summary.Cell>
  //         <Table.Summary.Cell index={2} align="center">
  //           <Text type="" className="font-bold">
  //             {data?.total_purchase}
  //           </Text>
  //         </Table.Summary.Cell>
  //         {/* <Table.Summary.Cell index={3} align="center">
  //           <Text type="" className="font-bold">
  //             // {/* {totalPrice} */}
  //         {/* </Text> */}
  //         {/* </Table.Summary.Cell> */}
  //       </Table.Summary.Row>
  //     </Table.Summary>
  //   );
  // },
  // sticky: {
  //   // offsetHeader: 440,
  //   offsetScroll: 400,
  // },

  scroll: {
    x: "max-content",
  },
  pagination: false,
  bordered: true,
};

const columns = [
  {
    title: "Total Purchase",
    dataIndex: "totalPurchase",
    key: "totalPurchase",
    align: "center",
    render: (totalPurchase) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {totalPurchase}
      </span>
    ),
  },
  {
    title: "Paid Amount",
    dataIndex: "paidAmount",
    key: "paidAmount",
    render: (paidAmount) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {paidAmount}
      </span>
    ),
  },

  {
    title: "Shipping Cost",
    dataIndex: "shippingCost",
    key: "shippingCost",
    render: (shippingCost) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {shippingCost}
      </span>
    ),
  },
  {
    title: "Tax",
    dataIndex: "tax",
    key: "tax",
    render: (tax) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {tax}
      </span>
    ),
  },
  {
    title: "Discount",
    dataIndex: "discount",
    key: "discount",
    render: (discount) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {discount}
      </span>
    ),
  },
  {
    title: "Grand Total",
    dataIndex: "grandTotal",
    key: "grandTotal",
    render: (grandTotal) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {grandTotal}
      </span>
    ),
  },
];

const PurchaseSummaryTable = ({ data }) => {
  const currency = useSelector(useCurrency);

  const tableStyleProps = {
    title: () => (
      <div className="font-semibold text-lg pl-0 underline">
        Purchase Summary
      </div>
    ),
    ...styleProps,
  };

  const dataSource = data?.purchase?.map((item) => {
    return {
      totalPurchase: data?.total_purchase,
      paidAmount: showCurrency(item?.paid_amount, currency),
      shippingCost: showCurrency(item?.shipping_cost, currency),
      tax: showCurrency(item?.tax, currency),
      discount: showCurrency(item?.discount, currency),
      grandTotal: showCurrency(item?.grand_total, currency),
    };
  });

  return (
    <Table {...tableStyleProps} columns={columns} dataSource={dataSource} />
  );
};

const SaleSummaryTable = ({ data }) => {
  const currency = useSelector(useCurrency);

  const tableStyleProps = {
    title: () => (
      <div className="font-semibold text-lg pl-0 underline">Sale Summary</div>
    ),
    ...styleProps,
  };

  const dataSource = data?.sale?.map((item) => {
    return {
      totalPurchase: data?.total_sale,
      paidAmount: showCurrency(item?.paid_amount, currency),
      shippingCost: showCurrency(item?.shipping_cost, currency),
      tax: showCurrency(item?.tax, currency),
      discount: showCurrency(item?.discount, currency),
      grandTotal: showCurrency(item?.grand_total, currency),
    };
  });

  return (
    <Table {...tableStyleProps} columns={columns} dataSource={dataSource} />
  );
};

const PurchaseReturnSummaryTable = ({ data }) => {
  const currency = useSelector(useCurrency);
  const columns = [
    {
      title: "Total Purchase Return",
      dataIndex: "totalPurchase",
      key: "totalPurchase",
      align: "center",
      render: (totalPurchase) => (
        <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
          {totalPurchase}
        </span>
      ),
    },
    {
      title: "Tax",
      dataIndex: "tax",
      key: "tax",
      render: (tax) => (
        <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
          {tax}
        </span>
      ),
    },

    {
      title: "Grand Total",
      dataIndex: "grandTotal",
      key: "grandTotal",
      render: (grandTotal) => (
        <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
          {grandTotal}
        </span>
      ),
    },
  ];

  const tableStyleProps = {
    title: () => (
      <div className="font-semibold text-lg pl-0 underline">
        Purchase Return Summary
      </div>
    ),
    ...styleProps,
  };

  const dataSource = data?.sale?.map((item) => {
    return {
      totalPurchase: data?.total_purchase_return,
      tax: showCurrency(item?.tax, currency),
      grandTotal: showCurrency(item?.grand_total, currency),
    };
  });

  return (
    <Table {...tableStyleProps} columns={columns} dataSource={dataSource} />
  );
};

const SaleReturnSummaryTable = ({ data }) => {
  const currency = useSelector(useCurrency);
  const columns = [
    {
      title: "Total Sale Return",
      dataIndex: "totalPurchase",
      key: "totalPurchase",
      align: "center",
      render: (totalPurchase) => (
        <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
          {totalPurchase}
        </span>
      ),
    },
    {
      title: "Tax",
      dataIndex: "tax",
      key: "tax",
      render: (tax) => (
        <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
          {tax}
        </span>
      ),
    },

    {
      title: "Grand Total",
      dataIndex: "grandTotal",
      key: "grandTotal",
      render: (grandTotal) => (
        <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
          {grandTotal}
        </span>
      ),
    },
  ];

  const tableStyleProps = {
    title: () => (
      <div className="font-semibold text-lg pl-0 underline">
        Sale Return Summary
      </div>
    ),
    ...styleProps,
  };

  const dataSource = data?.sale?.map((item) => {
    return {
      totalPurchase: data?.total_sale,
      tax: showCurrency(item?.tax, currency),
      grandTotal: showCurrency(item?.grand_total, currency),
    };
  });

  return (
    <Table {...tableStyleProps} columns={columns} dataSource={dataSource} />
  );
};

const PaymentReceivedSummaryTable = ({ data }) => {
  const currency = useSelector(useCurrency);
  const columns = [
    {
      title: "Payment Received Number",
      dataIndex: "payment_recieved_number",
      key: "payment_recieved_number",
      align: "center",
      render: (payment_recieved_number) => (
        <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
          {payment_recieved_number}
        </span>
      ),
    },
    {
      title: "Card",
      dataIndex: "card",
      key: "card",
      render: (card) => (
        <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
          {card}
        </span>
      ),
    },
    {
      title: "Cheque",
      dataIndex: "cheque",
      key: "cheque",
      render: (cheque) => (
        <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
          {cheque}
        </span>
      ),
    },
    {
      title: "Gift Card",
      dataIndex: "giftCard",
      key: "giftCard",
      render: (giftCard) => (
        <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
          {giftCard}
        </span>
      ),
    },
    {
      title: "Cash",
      dataIndex: "cash",
      key: "cash",
      render: (cash) => (
        <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
          {cash}
        </span>
      ),
    },
    {
      title: "Total Payment Received",
      dataIndex: "payment_recieved",
      key: "payment_recieved",
      render: (payment_recieved) => (
        <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
          {payment_recieved}
        </span>
      ),
    },
  ];

  const tableStyleProps = {
    title: () => (
      <div className="font-semibold text-lg pl-0 underline">
        Payment Received Summary
      </div>
    ),
    ...styleProps,
  };

  // payment_recieved_number: 0,
  //   payment_recieved: 0,
  //   card_payment_sale: 0,
  //   cheque_payment_sale: 0,
  //   gift_card_payment_sale: 0,
  //   cash_payment_sale: 0

  const dataSource = data?.sale?.map((item) => {
    return {
      payment_recieved_number: data?.payment_recieved_number,
      card: data?.card_payment_sale,
      cheque: data?.cheque_payment_sale,
      giftCard: data?.gift_card_payment_sale,
      cash: data?.cash_payment_sale,
      payment_recieved: showCurrency(item?.payment_recieved, currency),
    };
  });

  return (
    <Table {...tableStyleProps} columns={columns} dataSource={dataSource} />
  );
};

const PaymentSentSummaryTable = ({ data }) => {
  const currency = useSelector(useCurrency);
  const columns = [
    {
      title: "Payment Sent Number",
      dataIndex: "payment_sent_number",
      key: "payment_sent_number",
      align: "center",
      render: (payment_sent_number) => (
        <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
          {payment_sent_number}
        </span>
      ),
    },
    {
      title: "Card",
      dataIndex: "card",
      key: "card",
      render: (card) => (
        <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
          {card}
        </span>
      ),
    },
    {
      title: "Cheque",
      dataIndex: "cheque",
      key: "cheque",
      render: (cheque) => (
        <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
          {cheque}
        </span>
      ),
    },
    {
      title: "Cash",
      dataIndex: "cash",
      key: "cash",
      render: (cash) => (
        <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
          {cash}
        </span>
      ),
    },
    {
      title: "Total Payment Sent",
      dataIndex: "payment_sent",
      key: "payment_sent",
      render: (payment_sent) => (
        <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
          {payment_sent}
        </span>
      ),
    },
  ];

  const tableStyleProps = {
    title: () => (
      <div className="font-semibold text-lg pl-0 underline">
        Payment Sent Summary
      </div>
    ),
    ...styleProps,
  };

  const dataSource = data?.sale?.map((item) => {
    return {
      payment_sent_number: data?.payment_sent_number,
      card: data?.card_payment_purchase,
      cheque: data?.cheque_payment_purchase,
      cash: data?.cash_payment_purchase,
      payment_sale: showCurrency(item?.payment_sale, currency),
    };
  });

  return (
    <Table {...tableStyleProps} columns={columns} dataSource={dataSource} />
  );
};

const ExpenseSummaryTable = ({ data }) => {
  const currency = useSelector(useCurrency);
  const columns = [
    {
      title: "Expense",
      dataIndex: "expense",
      key: "expense",
      align: "center",
      render: (expense) => (
        <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
          {expense}
        </span>
      ),
    },

    {
      title: "Total Expenses",
      dataIndex: "totalExpenses",
      key: "totalExpenses",
      render: (totalExpenses) => (
        <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
          {totalExpenses}
        </span>
      ),
    },
  ];

  const tableStyleProps = {
    title: () => (
      <div className="font-semibold text-lg pl-0 underline">
        Expense Summary
      </div>
    ),
    ...styleProps,
  };

  const dataSource = data?.sale?.map((item) => {
    return {
      expense: data?.expense,
      totalExpenses: showCurrency(item?.total_expense, currency),
    };
  });

  return (
    <Table {...tableStyleProps} columns={columns} dataSource={dataSource} />
  );
};

const PayrollSummaryTable = ({ data }) => {
  const currency = useSelector(useCurrency);
  const columns = [
    {
      title: "Payroll",
      dataIndex: "payroll",
      key: "payroll",
      align: "center",
      render: (payroll) => (
        <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
          {payroll}
        </span>
      ),
    },

    {
      title: "Total Payroll",
      dataIndex: "totalPayroll",
      key: "totalPayroll",
      render: (totalPayroll) => (
        <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
          {totalPayroll}
        </span>
      ),
    },
  ];

  const tableStyleProps = {
    title: () => (
      <div className="font-semibold text-lg pl-0 underline">
        Payroll Summary
      </div>
    ),
    ...styleProps,
  };

  const dataSource = data?.sale?.map((item) => {
    return {
      payroll: data?.payroll,
      totalPayroll: showCurrency(item?.total_payroll, currency),
    };
  });

  return (
    <Table {...tableStyleProps} columns={columns} dataSource={dataSource} />
  );
};

export const Summary = () => {
  const [reportForm] = Form.useForm();
  const user = useSelector(useCurrentUser);

  const [dateRange, setDateRange] = useState();
  const [warehouse, setWarehouse] = useState(undefined);

  useEffect(() => {
    if (user?.warehouse_id) {
      reportForm.setFieldsValue({
        warehouse_id: user?.warehouse_id.toString(),
      });
      setWarehouse(user?.warehouse_id.toString());
    }

    const lastWeek = getLastWeek();

    reportForm.setFieldsValue({
      daterange: lastWeek,
    });
  }, [reportForm, user?.warehouse_id]);

  const onDateChange = (dates, dateStrings) => {
    setDateRange(dateStrings);
  };

  const onWarehouseChange = (warehouse) => {
    setWarehouse(warehouse);
  };

  const params = {
    daterange: dateRange,
    warehouse_id: warehouse,
  };

  const { data } = useGetReportSummaryQuery({ params });

  return (
    <ReportContainer
      pageTitle="Summary"
      form={reportForm}
      onDateChange={onDateChange}
      onWarehouseChange={onWarehouseChange}
    >
      <div className="space-y-5">
        <PurchaseSummaryTable data={data} />
        <SaleSummaryTable data={data} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <PurchaseReturnSummaryTable data={data} />
          <SaleReturnSummaryTable data={data} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <ExpenseSummaryTable data={data} />
          <PayrollSummaryTable data={data} />
        </div>
        <PaymentReceivedSummaryTable data={data} />
        <PaymentSentSummaryTable data={data} />
      </div>
    </ReportContainer>
  );
};
