import { DEPARTMENT } from "../../../../utilities/apiEndpoints/hrm.api";
import { openNotification } from "../../../../utilities/lib/openToaster";
import { verifyToken } from "../../../../utilities/lib/verifyToken";
import { baseApi } from "../../../api/baseApi";

const departmentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDepartments: build.query({
      query: ({ params }) => {
        return {
          url: `/${DEPARTMENT}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [
        { type: DEPARTMENT, ...params },
        DEPARTMENT,
      ],
    }),
    getDepartmentDetails: build.query({
      query: ({ id }) => {
        return {
          url: `${DEPARTMENT}/show/${id}`,
          method: "GET",
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { id }) => [{ type: DEPARTMENT, id }],
    }),
    createDepartment: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${DEPARTMENT}/store`,
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
        return result ? [{ type: DEPARTMENT }] : [];
      },
    }),
    updateDepartment: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `/${DEPARTMENT}/update/${id}`,
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
        return result ? [{ type: DEPARTMENT }] : [];
      },
    }),
    updateDepartmentStatus: build.mutation({
      query: (id) => {
        return {
          url: `/${DEPARTMENT}/status/${id}`,
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
        return result ? [{ type: DEPARTMENT }] : [];
      },
    }),
    deleteDepartment: build.mutation({
      query: (id) => {
        return {
          url: `/${DEPARTMENT}/delete/${id}`,
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
        return result ? [{ type: DEPARTMENT }] : [];
      },
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useGetDepartmentDetailsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useUpdateDepartmentStatusMutation,
  useDeleteDepartmentMutation,
} = departmentApi;
