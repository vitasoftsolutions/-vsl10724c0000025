// Import necessary dependencies
import { EMAIL_SETTING } from "../../../../utilities/apiEndpoints/settings.api";
import { openNotification } from "../../../../utilities/lib/openToaster";
import { verifyToken } from "../../../../utilities/lib/verifyToken";
import { baseApi } from "../../../api/baseApi";

const emailSettingsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllEmailSettings: build.query({
      query: () => ({
        url: `/${EMAIL_SETTING}/show/1`,
        method: "GET",
      }),
      transformResponse: (response) => verifyToken(response.data),
      providesTags: () => [{ type: EMAIL_SETTING }, EMAIL_SETTING],
    }),

    updateEmailSettings: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${EMAIL_SETTING}/update/1`,
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
        return result ? [EMAIL_SETTING] : [];
      },
    }),
  }),
});

export const { useGetAllEmailSettingsQuery, useUpdateEmailSettingsMutation } =
  emailSettingsApi;
