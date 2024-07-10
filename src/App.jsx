import { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import MainLayout from "./layout/MainLayout";

function App() {
  const { pathname } = useLocation();

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {pathname.includes("/dashboard") ? <DashboardLayout /> : <MainLayout />}
    </>
  );
}

export default App;
