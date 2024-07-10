import { PageContainer } from "@ant-design/pro-layout";
import { GlobalUtilityStyle } from "../../../container/Styled";
import { RewardForm } from "../../../../components/Settings/RewardSettings/RewardForm";

export const RewardSettings = () => {
  //   const { data, isLoading } = useGetGeneralSettingsQuery();

  //   //console.log(data);

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
            <div className="text-2xl lg:text-3xl py-1">Reward Settings</div>
          ),
        }}
        // loading={isLoading}
      >
        <RewardForm
        // data={data}
        />
      </PageContainer>
    </GlobalUtilityStyle>
  );
};
