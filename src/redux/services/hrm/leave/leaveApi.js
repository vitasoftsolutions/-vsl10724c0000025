// Import necessary dependencies
import { LEAVE } from "../../../../utilities/apiEndpoints/hrm.api";
import { openNotification } from "../../../../utilities/lib/openToaster";
import { verifyToken } from "../../../../utilities/lib/verifyToken";
import { baseApi } from "../../../api/baseApi";

const leaveApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllLeave: build.query({
      query: ({ params }) => ({
        url: `/${LEAVE}`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [
        { type: LEAVE, params },
        LEAVE,
      ],
    }),

    getLeaveDetails: build.query({
      query: ({ id, params }) => {
        return {
          url: `${LEAVE}/show/${id}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { id }) => [{ type: LEAVE, id }],
    }),

    createLeave: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${LEAVE}/store`,
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
        return result ? [LEAVE] : [];
      },
    }),

    updateLeave: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `/${LEAVE}/update/${id}`,
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
        return result ? [LEAVE] : [];
      },
    }),

    updateLeaveStatus: build.mutation({
      query: (id) => {
        return {
          url: `/${LEAVE}/status/${id}`,
          method: "POST",
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
        return result ? [LEAVE] : [];
      },
    }),

    deleteLeave: build.mutation({
      query: (id) => {
        return {
          url: `/${LEAVE}/delete/${id}`,
          method: "DELETE",
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
        return result ? [LEAVE] : [];
      },
    }),

    exportLeave: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${LEAVE}/export`,
          method: "GET",
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
    }),
  }),
});

export const {
  useGetAllLeaveQuery,
  useGetLeaveDetailsQuery,
  useCreateLeaveMutation,
  useUpdateLeaveMutation,
  useUpdateLeaveStatusMutation,
  useDeleteLeaveMutation,
  useExportLeaveMutation,
} = leaveApi;
