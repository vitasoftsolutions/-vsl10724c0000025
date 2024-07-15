import { CASHIER } from "../../../utilities/apiEndpoints/people.api";
import { openNotification } from "../../../utilities/lib/openToaster";
import { verifyToken } from "../../../utilities/lib/verifyToken";
import { baseApi } from "../../api/baseApi";

const cashierApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllCashier: build.query({
      query: ({ params }) => {
        return {
          url: `/${CASHIER}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [
        { type: CASHIER, ...params },
        CASHIER,
      ],
    }),

    getCashierDetails: build.query({
      query: ({ id }) => {
        return {
          url: `${CASHIER}/show/${id}`,
          method: "GET",
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { id }) => [{ type: CASHIER, id }],
    }),

    createCashier: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${CASHIER}/store`,
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
        return result ? [{ type: CASHIER }] : [];
      },
    }),

    updateCashier: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `/${CASHIER}/update/${id}`,
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
        return result ? [{ type: CASHIER }] : [];
      },
    }),

    updateCashierStatus: build.mutation({
      query: (id) => {
        return {
          url: `/${CASHIER}/status/${id}`,
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
        return result ? [{ type: CASHIER }] : [];
      },
    }),

    deleteCashier: build.mutation({
      query: (id) => {
        return {
          url: `/${CASHIER}/delete/${id}`,
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
        return result ? [{ type: CASHIER }] : [];
      },
    }),
  }),
});

export const {
  useGetAllCashierQuery,
  useGetCashierDetailsQuery,
  useCreateCashierMutation,
  useUpdateCashierMutation,
  useUpdateCashierStatusMutation,
  useDeleteCashierMutation,
} = cashierApi;
