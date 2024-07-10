export const columns = [
  {
    title: "Reference Id",
    dataIndex: "reference",
    key: "reference",
    align: "center",
    render: (reference) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {reference}
      </span>
    ),
  },
  {
    title: "Warehouse",
    dataIndex: "warehouse",
    key: "warehouse",
    align: "center",
    render: (warehouse) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {warehouse ?? "N/A"}
      </span>
    ),
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
    align: "center",
    render: (category) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {category ?? "N/A"}
      </span>
    ),
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    render: (amount) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {amount}
      </span>
    ),
  },
  {
    title: "Note",
    dataIndex: "note",
    key: "note",
    render: (note) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {note ?? "N/A"}
      </span>
    ),
  },
];
