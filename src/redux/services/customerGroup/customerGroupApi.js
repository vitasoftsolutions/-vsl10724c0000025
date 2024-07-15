import { CUSTOMER_GROUP } from "../../../utilities/apiEndpoints/helper.api";
import { openNotification } from "../../../utilities/lib/openToaster";
import { verifyToken } from "../../../utilities/lib/verifyToken";
import { baseApi } from "../../api/baseApi";

const customerGroupApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllCustomerGroup: build.query({
      query: ({ params }) => {
        return {
          url: `/${CUSTOMER_GROUP}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [
        { type: CUSTOMER_GROUP, ...params },
        CUSTOMER_GROUP,
      ],
    }),

    getCustomerGroupDetails: build.query({
      query: ({ id }) => {
        return {
          url: `${CUSTOMER_GROUP}/show/${id}`,
          method: "GET",
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { id }) => [{ type: CUSTOMER_GROUP, id }],
    }),

    createCustomerGroup: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${CUSTOMER_GROUP}/store`,
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
        return result ? [{ type: CUSTOMER_GROUP }] : [];
      },
    }),

    updateCustomerGroup: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `/${CUSTOMER_GROUP}/update/${id}`,
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
        return result ? [{ type: CUSTOMER_GROUP }] : [];
      },
    }),

    updateCustomerGroupStatus: build.mutation({
      query: (id) => {
        return {
          url: `/${CUSTOMER_GROUP}/status/${id}`,
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
        return result ? [{ type: CUSTOMER_GROUP }] : [];
      },
    }),

    deleteCustomerGroup: build.mutation({
      query: (id) => {
        return {
          url: `/${CUSTOMER_GROUP}/delete/${id}`,
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
        return result ? [{ type: CUSTOMER_GROUP }] : [];
      },
    }),
  }),
});

export const {
  useGetAllCustomerGroupQuery,
  useGetCustomerGroupDetailsQuery,
  useCreateCustomerGroupMutation,
  useUpdateCustomerGroupMutation,
  useUpdateCustomerGroupStatusMutation,
  useDeleteCustomerGroupMutation,
} = customerGroupApi;
