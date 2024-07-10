import { BiSolidPurchaseTag } from "react-icons/bi";
import { TbTruckReturn } from "react-icons/tb";
import PurchaseReturn from "../../pages/Dashboard/PurchaseReturn/PurchaseReturn";
import SaleReturn from "../../pages/Dashboard/SaleReturn/SaleReturn";

export const returnPaths = [
  {
    name: "Purchase Return",
    path: "purchase-return",
    icon: BiSolidPurchaseTag,
    element: <PurchaseReturn />,
  },
  {
    name: "Sale Return",
    path: "sale-return",
    icon: TbTruckReturn,
    element: <SaleReturn />,
  },
];
