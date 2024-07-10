import { openNotification } from "../../utilities/lib/openToaster";
import { baseApi } from "../api/baseApi";

const bulkDeleteApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    bulkDelete: build.mutation({
      query: ({ url, data }) => {
        return {
          url: `/${url}/bulk-delete`,
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
      invalidatesTags: (result, error, { url }) => {
        return result ? [url] : [];
      },
    }),
  }),
});

export const { useBulkDeleteMutation } = bulkDeleteApi;
