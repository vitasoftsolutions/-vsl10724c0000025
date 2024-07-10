import { HiWallet } from "react-icons/hi2";
import { SlWallet } from "react-icons/sl";
import Expense from "../../pages/Dashboard/Expense/Expense";
import ExpenseCategory from "../../pages/Dashboard/ExpenseCategory/ExpenseCategory";

export const expensePaths = [
  {
    name: "Expense Category",
    path: "expense-category",
    icon: HiWallet,
    element: <ExpenseCategory />,
  },
  {
    name: "Expense",
    path: "expense",
    icon: SlWallet,
    element: <Expense />,
  },
];
