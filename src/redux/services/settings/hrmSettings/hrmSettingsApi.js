// Import necessary dependencies
import { HRM_SETTING } from "../../../../utilities/apiEndpoints/settings.api";
import { openNotification } from "../../../../utilities/lib/openToaster";
import { verifyToken } from "../../../../utilities/lib/verifyToken";
import { baseApi } from "../../../api/baseApi";

const hrmSettingsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllHrmSetting: build.query({
      query: () => ({
        url: `/${HRM_SETTING}/show/1`,
        method: "GET",
      }),
      transformResponse: (response) => verifyToken(response.data),
      providesTags: () => [{ type: HRM_SETTING }, HRM_SETTING],
    }),

    updateHrmSetting: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${HRM_SETTING}/update/1`,
          method: "POST",
          body: data,
        };
      },
      transformResponse: (response) => {
        if (response?.success) {
          openNotification("success", response?.message);
          return response;
        }
      },
      transformErrorResponse: (response) => {
        if (response?.data?.success === false) {
          openNotification("error", response?.data?.message);
          return response;
        }
      },
      invalidatesTags: (result) => {
        return result ? [HRM_SETTING] : [];
      },
    }),
  }),
});

export const { useGetAllHrmSettingQuery, useUpdateHrmSettingMutation } =
  hrmSettingsApi;
