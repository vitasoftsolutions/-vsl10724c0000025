import { CUSTOMER } from "../../../utilities/apiEndpoints/people.api";
import { openNotification } from "../../../utilities/lib/openToaster";
import { verifyToken } from "../../../utilities/lib/verifyToken";
import { baseApi } from "../../api/baseApi";

const customerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllCustomer: build.query({
      query: ({ params }) => {
        return {
          url: `/${CUSTOMER}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [
        { type: CUSTOMER, ...params },
        CUSTOMER,
      ],
    }),

    getCustomerDetails: build.query({
      query: ({ id }) => {
        return {
          url: `${CUSTOMER}/show/${id}`,
          method: "GET",
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { id }) => [{ type: CUSTOMER, id }],
    }),

    createCustomer: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${CUSTOMER}/store`,
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
        return result ? [{ type: CUSTOMER }] : [];
      },
    }),

    updateCustomer: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `/${CUSTOMER}/update/${id}`,
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
        return result ? [{ type: CUSTOMER }] : [];
      },
    }),

    updateCustomerStatus: build.mutation({
      query: (id) => {
        return {
          url: `/${CUSTOMER}/status/${id}`,
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
        return result ? [{ type: CUSTOMER }] : [];
      },
    }),

    deleteCustomer: build.mutation({
      query: (id) => {
        return {
          url: `/${CUSTOMER}/delete/${id}`,
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
        return result ? [{ type: CUSTOMER }] : [];
      },
    }),
  }),
});

export const {
  useGetAllCustomerQuery,
  useGetCustomerDetailsQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useUpdateCustomerStatusMutation,
  useDeleteCustomerMutation,
} = customerApi;
