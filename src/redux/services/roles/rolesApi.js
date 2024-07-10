// Import necessary dependencies
import { ROLE } from "../../../utilities/apiEndpoints/auth.api";
import { openNotification } from "../../../utilities/lib/openToaster";
import { verifyToken } from "../../../utilities/lib/verifyToken";
import { baseApi } from "../../api/baseApi";

const rolesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllRoles: build.query({
      query: ({ params }) => ({
        url: `/${ROLE}`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [
        { type: ROLE, params },
        ROLE,
      ],
    }),

    getRolesDetails: build.query({
      query: ({ id, params }) => {
        return {
          url: `${ROLE}/show/${id}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { id }) => [{ type: ROLE, id }],
    }),

    createRoles: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${ROLE}/store`,
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
        return result ? [ROLE] : [];
      },
    }),

    updateRoles: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `/${ROLE}/update/${id}`,
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
        return result ? [ROLE] : [];
      },
    }),

    updateRolesStatus: build.mutation({
      query: (id) => {
        return {
          url: `/${ROLE}/status/${id}`,
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
        return result ? [ROLE] : [];
      },
    }),

    deleteRoles: build.mutation({
      query: (id) => {
        return {
          url: `/${ROLE}/delete/${id}`,
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
        return result ? [ROLE] : [];
      },
    }),

    exportRoles: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${ROLE}/export`,
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
  useGetAllRolesQuery,
  useGetRolesDetailsQuery,
  useCreateRolesMutation,
  useUpdateRolesMutation,
  useUpdateRolesStatusMutation,
  useDeleteRolesMutation,
  useExportRolesMutation,
} = rolesApi;
