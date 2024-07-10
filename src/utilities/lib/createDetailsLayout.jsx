import { Badge } from "antd";
import dayjs from "dayjs";
import parse from "html-react-parser";
import defaultUser from "../../assets/data/defaultUserImage";

const createDetailsLayout = (data, nostyle) => {
  const ignoredKeys = [
    "id",
    "created_at",
    "updated_at",
    "deleted_at",
    "adjustment_products",
    "purchase_products",
    "sale_products",
    "quotation_products",
  ];

  const fullRowKeys = [
    "details",
    "address",
    "attachments",
    "reason",
    "note",
    "description",
    "reference_id",
  ];

  const booleanKeys = [
    "is_active",
    "has_stock",
    "has_featured",
    "has_promotion",
    "has_different_price",
    "has_expired_date",
    "has_variants",
  ];

  const currencyKeys = [
    "price",
    "tax",
    "discount",
    "total",
    "grand_total",
    "paid",
    "due",
    "return_amount",
    "expense",
  ];

  const renderValue = (key, value) => {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      return value.name || "N/A";
    }

    switch (key) {
      case "is_active":
        return value?.toString() === "1" ? (
          <Badge status="success" text="Active" key={"active"} />
        ) : (
          <Badge status="default" text="Inactive" key={"inactive"} />
        );

      case "details":
        return value ? <div>{parse(value)}</div> : "N/A";

      case "attachments":
        return Array.isArray(value) ? (
          <div className="flex items-center gap-3" key={"attachments"}>
            {value?.map(({ label, url }) => (
              <img
                src={defaultUser}
                // src={url ?? defaultUser}
                alt={label}
                key={url}
                className="w-24"
              />
            ))}
          </div>
        ) : (
          "N/A"
        );

      default:
        if (key.includes("status")) {
          if (!value) return <Badge status="warning" text={"Incomplete"} />;

          return value?.toLowerCase() === "pending" ||
            value?.toLowerCase() === "incomplete" ? (
            <Badge status="warning" text={value} />
          ) : (
            <Badge status="success" text={value} />
          );
        }

        if (currencyKeys.includes(key)) {
          return `{value}`;
        }
        if (key.includes("date")) {
          return dayjs(value).format("DD-MM-YYYY");
        }
        if (booleanKeys.includes(key) && value?.toString() === "1") {
          return "True";
        }
        if (booleanKeys.includes(key) && value?.toString() === "0") {
          return "False";
        }

        if (!Array.isArray(value)) return value || "N/A";
    }
  };

  const details = Object.entries(data ?? {}).reduce(
    (acc, [key, value], index) => {
      if (ignoredKeys.includes(key)) {
        return acc;
      }

      if (key.includes("_id") && key !== "reference_id") {
        return acc;
      }

      if (!ignoredKeys.includes(key)) {
        const capitalizedLabel = key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

        const item = {
          key: index + 1,
          label: capitalizedLabel,
          children: renderValue(key, value),
          span: nostyle
            ? 2
            : fullRowKeys.includes(key) || key.includes("note")
            ? 4
            : 2,
        };
        acc.push(item);
      }
      return acc;
    },
    []
  );

  //console.log(details);

  return details;
};

export default createDetailsLayout;
