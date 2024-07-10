// Import necessary dependencies
import { LEAVE_TYPE } from "../../../../utilities/apiEndpoints/hrm.api";
import { openNotification } from "../../../../utilities/lib/openToaster";
import { verifyToken } from "../../../../utilities/lib/verifyToken";
import { baseApi } from "../../../api/baseApi";

const leaveType = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllLeaveType: build.query({
      query: ({ params }) => ({
        url: `/${LEAVE_TYPE}`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [
        { type: LEAVE_TYPE, params },
        LEAVE_TYPE,
      ],
    }),

    getLeaveTypeDetails: build.query({
      query: ({ id, params }) => {
        return {
          url: `${LEAVE_TYPE}/show/${id}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { id }) => [{ type: LEAVE_TYPE, id }],
    }),

    createLeaveType: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${LEAVE_TYPE}/store`,
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
        return result ? [LEAVE_TYPE] : [];
      },
    }),

    updateLeaveType: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `/${LEAVE_TYPE}/update/${id}`,
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
        return result ? [LEAVE_TYPE] : [];
      },
    }),

    updateLeaveTypeStatus: build.mutation({
      query: (id) => {
        return {
          url: `/${LEAVE_TYPE}/status/${id}`,
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
        return result ? [LEAVE_TYPE] : [];
      },
    }),

    deleteLeaveType: build.mutation({
      query: (id) => {
        return {
          url: `/${LEAVE_TYPE}/delete/${id}`,
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
        return result ? [LEAVE_TYPE] : [];
      },
    }),

    exportLeaveType: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${LEAVE_TYPE}/export`,
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
  useGetAllLeaveTypeQuery,
  useGetLeaveTypeDetailsQuery,
  useCreateLeaveTypeMutation,
  useUpdateLeaveTypeMutation,
  useUpdateLeaveTypeStatusMutation,
  useDeleteLeaveTypeMutation,
  useExportLeaveTypeMutation,
} = leaveType;
