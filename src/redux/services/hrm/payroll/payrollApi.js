// Import necessary dependencies
import { PAYROLL } from "../../../../utilities/apiEndpoints/hrm.api";
import { openNotification } from "../../../../utilities/lib/openToaster";
import { verifyToken } from "../../../../utilities/lib/verifyToken";
import { baseApi } from "../../../api/baseApi";

const payrollApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllPayroll: build.query({
      query: ({ params }) => ({
        url: `/${PAYROLL}`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [
        { type: PAYROLL, ...params },
        PAYROLL,
      ],
    }),

    getPayrollDetails: build.query({
      query: ({ id, params }) => {
        return {
          url: `${PAYROLL}/show/${id}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { id }) => [{ type: PAYROLL, id }],
    }),

    createPayroll: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${PAYROLL}/store`,
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
        return result ? [{ type: PAYROLL }] : [];
      },
    }),

    updatePayroll: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `/${PAYROLL}/update/${id}`,
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
        return result ? [{ type: PAYROLL }] : [];
      },
    }),

    updatePayrollStatus: build.mutation({
      query: (id) => {
        return {
          url: `/${PAYROLL}/status/${id}`,
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
        return result ? [{ type: PAYROLL }] : [];
      },
    }),

    deletePayroll: build.mutation({
      query: (id) => {
        return {
          url: `/${PAYROLL}/delete/${id}`,
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
        return result ? [{ type: PAYROLL }] : [];
      },
    }),

    exportPayroll: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${PAYROLL}/export`,
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
  useGetAllPayrollQuery,
  useGetPayrollDetailsQuery,
  useCreatePayrollMutation,
  useUpdatePayrollMutation,
  useUpdatePayrollStatusMutation,
  useDeletePayrollMutation,
  useExportPayrollMutation,
} = payrollApi;
