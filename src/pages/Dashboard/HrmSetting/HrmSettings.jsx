import { PageContainer } from "@ant-design/pro-layout";
import { GlobalUtilityStyle } from "../../../container/Styled";
import { useGetAllHrmSettingQuery } from "../../../redux/services/settings/hrmSettings/hrmSettingsApi";
import { HrmSettingForm } from "./HrmSettingsForm";

export const HrmSettings = () => {
  const { data, isLoading } = useGetAllHrmSettingQuery();

  return (
    <GlobalUtilityStyle>
      <PageContainer
        header={{
          title: (
            <div className="text-2xl lg:text-3xl border-r-2 pr-2 border-black py-1">
              Settings
            </div>
          ),
          subTitle: (
            <div className="text-2xl lg:text-3xl py-1">HRM Settings</div>
          ),
        }}
        loading={isLoading}

        // tabList={[
        //   {
        //     key: "general",
        //     tab: "General",
        //     children: <div>General</div>,
        //   },
        //   {
        //     key: "email",
        //     tab: "Email",
        //     children: <div>Email</div>,
        //   },
        // ]}
        // tabProps={{
        //   tabPosition: "left",
        //   style: {
        //     // height: "100%",
        //     marginTop: "20px",
        //     border: "1px solid #d9d9d9",
        //   },
        // }}
      >
        <HrmSettingForm data={data} />
      </PageContainer>
    </GlobalUtilityStyle>
  );
};
