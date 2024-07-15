// Import necessary dependencies
import { ATTENDANCE } from "../../../../utilities/apiEndpoints/hrm.api";
import { openNotification } from "../../../../utilities/lib/openToaster";
import { verifyToken } from "../../../../utilities/lib/verifyToken";
import { baseApi } from "../../../api/baseApi";

const attendenceApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllAttendence: build.query({
      query: ({ params }) => ({
        url: `/${ATTENDANCE}`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [
        { type: ATTENDANCE, ...params },
        ATTENDANCE,
      ],
    }),

    getAttendenceDetails: build.query({
      query: ({ id, params }) => {
        return {
          url: `${ATTENDANCE}/show/${id}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { id }) => [{ type: ATTENDANCE, id }],
    }),

    createAttendence: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${ATTENDANCE}/store`,
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
        return result ? [{ type: ATTENDANCE }] : [];
      },
    }),

    updateAttendence: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `/${ATTENDANCE}/update/${id}`,
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
        return result ? [{ type: ATTENDANCE }] : [];
      },
    }),

    updateAttendenceStatus: build.mutation({
      query: (id) => {
        return {
          url: `/${ATTENDANCE}/status/${id}`,
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
        return result ? [{ type: ATTENDANCE }] : [];
      },
    }),

    deleteAttendence: build.mutation({
      query: (id) => {
        return {
          url: `/${ATTENDANCE}/delete/${id}`,
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
        return result ? [{ type: ATTENDANCE }] : [];
      },
    }),

    exportAttendence: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${ATTENDANCE}/export`,
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
  useGetAllAttendenceQuery,
  useGetAttendenceDetailsQuery,
  useCreateAttendenceMutation,
  useUpdateAttendenceMutation,
  useUpdateAttendenceStatusMutation,
  useDeleteAttendenceMutation,
  useExportAttendenceMutation,
} = attendenceApi;
