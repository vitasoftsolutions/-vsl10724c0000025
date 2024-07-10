import { LiaFileInvoiceSolid } from "react-icons/lia";
import { LuClipboardList } from "react-icons/lu";
import Invoice from "../../pages/Dashboard/Invoice/Invoice";
import Quotation from "../../pages/Dashboard/Quotations/Quotation";

export const generatorPaths = [
  {
    name: "Quotation Generator",
    path: "quotation",
    icon: LuClipboardList,
    element: <Quotation />,
  },
  {
    name: "Invoice Generator",
    path: "invoice",
    icon: LiaFileInvoiceSolid,
    element: <Invoice />,
  },
];
