// Import necessary dependencies
import { NOTIFICATION } from "../../../utilities/apiEndpoints/helper.api";
import { openNotification } from "../../../utilities/lib/openToaster";
import { verifyToken } from "../../../utilities/lib/verifyToken";
import { baseApi } from "../../api/baseApi";

const notificationSlice = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllNotification: build.query({
      query: ({ params }) => ({
        url: `/${NOTIFICATION}`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [
        { type: NOTIFICATION, ...params },
        NOTIFICATION,
      ],
    }),

    getNotificationDetails: build.query({
      query: ({ id, params }) => {
        return {
          url: `${NOTIFICATION}/show/${id}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { id }) => [{ type: NOTIFICATION, id }],
    }),

    createNotification: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${NOTIFICATION}/store`,
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
        return result ? [{ type: NOTIFICATION }] : [];
      },
    }),

    updateNotification: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `/${NOTIFICATION}/update/${id}`,
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
      invalidatesTags: (result) => {
        return result ? [{ type: NOTIFICATION }] : [];
      },
    }),

    updateNotificationStatus: build.mutation({
      query: (id) => {
        return {
          url: `/${NOTIFICATION}/status/${id}`,
          method: "POST",
        };
      },
      transformResponse: (response) => {
        if (response?.success) {
          openNotification("success", response?.message);
          return response;
        }
      },
      invalidatesTags: (result) => {
        return result ? [{ type: NOTIFICATION }] : [];
      },
    }),

    deleteNotification: build.mutation({
      query: (id) => {
        return {
          url: `/${NOTIFICATION}/delete/${id}`,
          method: "DELETE",
        };
      },
      transformResponse: (response) => {
        if (response?.success) {
          openNotification("success", response?.message);
          return response;
        }
      },
      invalidatesTags: (result) => {
        return result ? [{ type: NOTIFICATION }] : [];
      },
    }),
  }),
});

export const {
  useGetAllNotificationQuery,
  useGetNotificationDetailsQuery,
  useCreateNotificationMutation,
  useUpdateNotificationMutation,
  useUpdateNotificationStatusMutation,
  useDeleteNotificationMutation,
} = notificationSlice;
