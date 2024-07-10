import { Spin } from "antd";
import { useGetLeaveDetailsQuery } from "../../redux/services/hrm/leave/leaveApi";
import createDetailsLayout from "../../utilities/lib/createDetailsLayout";
import { CustomDescription } from "../Shared/Description/CustomDescription";
import CustomModal from "../Shared/Modal/CustomModal";

export const LeaveDetails = ({ id, ...props }) => {
  const { data, isFetching } = useGetLeaveDetailsQuery(
    {
      id,
      params: {
        parent: 1,
        child: 1,
      },
    },
    { skip: !id }
  );

  const details = createDetailsLayout(data);

  return (
    <CustomModal {...props}>
      {isFetching ? (
        <Spin className="w-full flex justify-center items-center mt-10" />
      ) : (
        <div className="space-y-5 max-h-[75vh] overflow-y-auto pt-3 pb-5">
          <CustomDescription title="Leave " items={details} />
        </div>
      )}
    </CustomModal>
  );
};
