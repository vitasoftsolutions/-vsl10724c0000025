import { BiTransfer } from "react-icons/bi";
import TransferList from "../../pages/Dashboard/Transfer/TransferList";

export const transferPaths = [
  {
    name: "Transfer List",
    path: "transfer-list",
    icon: BiTransfer,
    element: <TransferList />,
  },
];
