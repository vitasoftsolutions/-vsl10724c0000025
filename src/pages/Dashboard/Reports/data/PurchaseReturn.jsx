export const columns = [
  {
    title: "Return Reference",
    dataIndex: "referenceNo",
    key: "referenceNo",
    align: "center",
    render: (text) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {text}
      </span>
    ),
  },
  {
    title: "Purchase Reference",
    dataIndex: "purchaseReference",
    key: "purchaseReference",
    align: "center",
    render: (text) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {text}
      </span>
    ),
  },

  {
    title: "Warehouse",
    dataIndex: "warehouse",
    key: "warehouse",
    render: (text) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {text ?? "N/A"}
      </span>
    ),
  },
  {
    title: "Supplier",
    dataIndex: "supplier",
    key: "supplier",
    render: (text) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {text ?? "N/A"}
      </span>
    ),
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    align: "center",
    render: (text) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {text}
      </span>
    ),
  },
  {
    title: "Grand Total",
    dataIndex: "grandTotal",
    key: "grandTotal",
    render: (text) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {text}
      </span>
    ),
  },
];
