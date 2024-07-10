import { AiOutlineStock } from "react-icons/ai";
import { TbTransferIn } from "react-icons/tb";
import StockCount from "../../pages/Dashboard/StockCount/StockCount";
import TransferList from "../../pages/Dashboard/Transfer/TransferList";

export const inventoryPaths = [
  {
    name: "Stock Count",
    path: "stock-count",
    icon: AiOutlineStock,
    element: <StockCount />,
  },
  {
    name: "Transfer",
    path: "transfer",
    icon: TbTransferIn,
    element: <TransferList />,
  },
  // {
  //   name: "Stock Request",
  //   path: "stock-request",
  //   icon: VscGitPullRequestGoToChanges,
  //   element: <StockRequest />,
  // },
];
