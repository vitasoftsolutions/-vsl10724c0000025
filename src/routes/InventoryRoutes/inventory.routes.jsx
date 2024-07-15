import { AiOutlineStock } from "react-icons/ai";
import { GoChecklist } from "react-icons/go";
import { PiWarehouse } from "react-icons/pi";
import { TbTransferIn } from "react-icons/tb";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
import AdjustmentList from "../../pages/Dashboard/AdjustmentList/AdjustmentList";
import StockCount from "../../pages/Dashboard/StockCount/StockCount";
import StockRequest from "../../pages/Dashboard/StockRequest/StockRequest";
import TransferList from "../../pages/Dashboard/Transfer/TransferList";
import Warehouse from "../../pages/Dashboard/Warehouse/Warehouse";

export const inventoryPaths = [
  {
    name: "Warehouse",
    path: "warehouse",
    icon: PiWarehouse,
    element: <Warehouse />,
  },
  {
    name: "Adjustment",
    path: "adjustment",
    icon: GoChecklist,
    element: <AdjustmentList />,
  },
  {
    name: "Transfer",
    path: "transfer",
    icon: TbTransferIn,
    element: <TransferList />,
  },
  {
    name: "Stock Count",
    path: "stock-count",
    icon: AiOutlineStock,
    element: <StockCount />,
  },
  {
    name: "Stock Request",
    path: "stock-request",
    icon: VscGitPullRequestGoToChanges,
    element: <StockRequest />,
  },
];
