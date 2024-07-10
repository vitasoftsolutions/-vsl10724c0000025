import { App, ConfigProvider, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "styled-components";
import { setDeveloper } from "../redux/services/developer/developerSlice";
import { setMenuItems } from "../redux/services/menu/menuSlice";
import { setCurrency } from "../redux/services/pos/posSlice";
import { useGetGeneralSettingsQuery } from "../redux/services/settings/generalSettings/generalSettingsApi";
import {
  setPrimaryColor,
  setSecondaryColor,
} from "../redux/services/theme/themeSlice";
import { adminPaths } from "../routes/admin.routes";
import { router } from "../routes/routes";
import { theme } from "../utilities/configs/theme";
import { useMenuItems } from "../utilities/lib/getPermission";

const LoadingComponent = (data) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 10000); // 5 seconds
    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  if (!data || isLoading) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center gap-5">
        <Spin size="large" />
        <span>Setting up your environment...</span>
      </div>
    );
  }
};

export const ProviderConfig = ({ children }) => {
  const dispatch = useDispatch();

  const { primaryColor, secondaryColor, textColor } = useSelector(
    (state) => state.theme
  );

  const { developedBy } = useSelector((state) => state.developer);

  const { data } = useGetGeneralSettingsQuery();

  // const user = useSelector(useCurrentUser);
  // const warehouseId = user?.warehouse_id;

  // const { data: pettyCashData } = useCheckPettyCashQuery(
  //   {
  //     params: {
  //       warehouse_id: parseInt(warehouseId),
  //     },
  //   },
  //   {
  //     skip: !warehouseId,
  //   }
  // );

  // // const { pettyCash } = useSelector((state) => state.pettyCash);

  // useEffect(() => {
  //   if (pettyCashData?.data) {
  //     dispatch(setPettyCash(pettyCashData?.data));
  //   }
  // }, [pettyCashData?.data, dispatch]);

  const menuItems = useMenuItems(adminPaths);

  useEffect(() => {
    if (data) {
      dispatch(setPrimaryColor(data.primary_color));
      dispatch(setSecondaryColor(data.secendary_color));

      document.documentElement.style.setProperty(
        "--firstColor",
        data?.primary_color ? data?.primary_color : "#842577"
      );
      document.documentElement.style.setProperty(
        "--secondColor",
        data?.secendary_color ? data?.secendary_color : "#B391AC"
      );

      dispatch(
        setDeveloper({
          developedBy: data?.developed_by,
          hyperLink: data?.developed_by_link,
        })
      );

      dispatch(
        setCurrency({
          name: data?.currency,
          position: data?.currency_position,
        })
      );
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (menuItems.length) {
      dispatch(setMenuItems({ menuItems }));
    }
  }, [dispatch, menuItems]);

  const customTheme = theme({ primaryColor, secondaryColor, textColor });

  if (!developedBy && !data) return <LoadingComponent data={data} />;

  return (
    <React.StrictMode>
      <ConfigProvider
        theme={customTheme}
        locale={{
          locale: "en-US",
        }}
      >
        {/* styled components */}
        <App>
          <ThemeProvider theme={{ ...customTheme }}>
            <RouterProvider router={router}>{children}</RouterProvider>
          </ThemeProvider>
          <Toaster position="top-center" richColors />
        </App>
      </ConfigProvider>
    </React.StrictMode>
  );
};
