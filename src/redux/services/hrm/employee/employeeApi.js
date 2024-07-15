// Import necessary dependencies
import { EMPLOYEE } from "../../../../utilities/apiEndpoints/hrm.api";
import { openNotification } from "../../../../utilities/lib/openToaster";
import { verifyToken } from "../../../../utilities/lib/verifyToken";
import { baseApi } from "../../../api/baseApi";

const employeeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllEmployee: build.query({
      query: ({ params }) => ({
        url: `/${EMPLOYEE}`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [
        { type: EMPLOYEE, ...params },
        EMPLOYEE,
      ],
    }),

    getEmployeeDetails: build.query({
      query: ({ id, params }) => {
        return {
          url: `${EMPLOYEE}/show/${id}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { id }) => [{ type: EMPLOYEE, id }],
    }),

    createEmployee: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${EMPLOYEE}/store`,
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
        return result ? [{ type: EMPLOYEE }] : [];
      },
    }),

    updateEmployee: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `/${EMPLOYEE}/update/${id}`,
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
        return result ? [{ type: EMPLOYEE }] : [];
      },
    }),

    updateEmployeeStatus: build.mutation({
      query: (id) => {
        return {
          url: `/${EMPLOYEE}/status/${id}`,
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
        return result ? [{ type: EMPLOYEE }] : [];
      },
    }),

    deleteEmployee: build.mutation({
      query: (id) => {
        return {
          url: `/${EMPLOYEE}/delete/${id}`,
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
        return result ? [{ type: EMPLOYEE }] : [];
      },
    }),

    exportEmployee: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${EMPLOYEE}/export`,
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
  useGetAllEmployeeQuery,
  useGetEmployeeDetailsQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useUpdateEmployeeStatusMutation,
  useDeleteEmployeeMutation,
  useExportEmployeeMutation,
} = employeeApi;
