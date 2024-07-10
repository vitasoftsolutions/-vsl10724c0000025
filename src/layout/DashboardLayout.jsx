import { Button, Layout, Tag } from "antd";
// import { Footer } from "antd/es/layout/layout";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Outlet } from "react-router-dom";
import Logo from "../components/AllSection/Header/Logo";
import Profile from "../components/AllSection/Header/Profile";
import { GlobalUtilityStyle } from "../container/Styled";
import { mode } from "../utilities/configs/base_url";
import SideBar from "./SideBar";
import { useSelector } from "react-redux";

const { Header, Content, Footer } = Layout;

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const { developedBy, hyperLink } = useSelector((state) => state.developer);

  return (
    <GlobalUtilityStyle>
      <div className="relative">
        <Header className="bg-white flex justify-between items-center px-5 fixed w-full top-0 z-50 shadow-md">
          <div className="flex items-center gap-6 text-2xl">
            <Button
              className="p-0 border border-none rounded-full flex items-center justify-center text-[20px]"
              type="text"
              icon={<GiHamburgerMenu />}
              onClick={() => setCollapsed(!collapsed)}
            ></Button>
            <Logo />
          </div>
          {mode === "local" && (
            <Tag color="processing" className="font-semibold">
              {mode.toUpperCase()} MODE
            </Tag>
          )}
          <Profile />
        </Header>

        <div className="flex pt-16">
          <div className="h-[calc(100vh-4rem)] sticky z-40 top-[4rem] left-0 ">
            <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />
          </div>

          <Layout className="w-48 flex flex-col ">
            <Content
              style={{
                margin: "16px",
                marginBottom: 0,
                // backgroundColor: "white",
                // borderRadius: "8px",
              }}
              className="flex-grow overflow-auto"
            >
              <GlobalUtilityStyle>
                <Outlet />
              </GlobalUtilityStyle>
            </Content>
            <Footer
              style={{
                textAlign: "center",
                padding: "16px",
              }}
            >
              POS Inventory ©{new Date().getFullYear()} Created by{" "}
              <a
                href={`http://${hyperLink}`}
                className="primary-text hover:underline font-semibold"
                target="_blank"
                rel="noopener noreferrer"
              >
                {developedBy ?? "Vitasoft Solutions"}
              </a>
            </Footer>
          </Layout>
        </div>
      </div>
    </GlobalUtilityStyle>
  );
};
export default DashboardLayout;
