import { IoCalendarNumberOutline } from "react-icons/io5";
import {
  TbAlertSquare,
  TbBrandGoogleAnalytics,
  TbReportAnalytics,
} from "react-icons/tb";
import { AlertProductReport } from "../../pages/Dashboard/Reports/AlertProductReport";
import { CustomerReport } from "../../pages/Dashboard/Reports/CustomerReport";
import { ProductReport } from "../../pages/Dashboard/Reports/ProductReport";
import { PurchaseCalender } from "../../pages/Dashboard/Reports/PurchaseCalender";
import { PurchaseReport } from "../../pages/Dashboard/Reports/PurchaseReport";
import { SaleCalender } from "../../pages/Dashboard/Reports/SaleCalender";
import { SaleReport } from "../../pages/Dashboard/Reports/SaleReport";
import { Summary } from "../../pages/Dashboard/Reports/Summary";
import { SupplierReport } from "../../pages/Dashboard/Reports/SupplierReport";
import { WarehouseReport } from "../../pages/Dashboard/Reports/WarehouseReport";

export const reportPaths = [
  {
    name: "Summary",
    path: "summary",
    icon: TbBrandGoogleAnalytics,
    element: <Summary />,
  },
  {
    name: "Product Report",
    path: "product",
    icon: TbReportAnalytics,
    element: <ProductReport />,
  },
  {
    name: "Alert Product Report",
    path: "alert-product",
    icon: TbAlertSquare,
    element: <AlertProductReport />,
  },
  {
    name: "Purchase Report",
    path: "purchase",
    icon: TbReportAnalytics,
    element: <PurchaseReport />,
  },
  {
    name: "Purchase Calender",
    path: "purchase-calender",
    icon: IoCalendarNumberOutline,
    element: <PurchaseCalender />,
  },

  {
    name: "Sale Report",
    path: "sale",
    icon: TbReportAnalytics,
    element: <SaleReport />,
  },
  {
    name: "Sale Calender",
    path: "sale-calender",
    icon: IoCalendarNumberOutline,
    element: <SaleCalender />,
  },
  {
    name: "Warehouse Report",
    path: "warehouse",
    icon: TbReportAnalytics,
    element: <WarehouseReport />,
  },
  {
    name: "Supplier Report",
    path: "supplier",
    icon: TbReportAnalytics,
    element: <SupplierReport />,
  },
  {
    name: "Customer Report",
    path: "customer",
    icon: TbReportAnalytics,
    element: <CustomerReport />,
  },
];
