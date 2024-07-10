import { FaChalkboardUser } from "react-icons/fa6";
import { LiaCashRegisterSolid } from "react-icons/lia";
import { PiUserList } from "react-icons/pi";
import Cashier from "../../pages/Dashboard/Cashier/Cashier";
import Customer from "../../pages/Dashboard/Customer/Customer";
import { Supplier } from "../../pages/Dashboard/Supplier/Supplier";

export const peoplePaths = [
  {
    name: "Customer",
    path: "customer",
    icon: PiUserList,
    element: <Customer />,
  },
  {
    name: "Supplier",
    path: "supplier",
    icon: FaChalkboardUser,
    element: <Supplier />,
  },
  {
    name: "Cashier",
    path: "cashier",
    icon: LiaCashRegisterSolid,
    element: <Cashier />,
  },
];
