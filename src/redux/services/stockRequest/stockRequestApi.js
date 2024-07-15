// Import necessary dependencies
import { STOCK_REQUEST } from "../../../utilities/apiEndpoints/inventory.api";
import { openNotification } from "../../../utilities/lib/openToaster";
import { verifyToken } from "../../../utilities/lib/verifyToken";
import { baseApi } from "../../api/baseApi";

const stockRequestApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllStockRequest: build.query({
      query: ({ params }) => ({
        url: `/${STOCK_REQUEST}`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [
        { type: STOCK_REQUEST, ...params },
        STOCK_REQUEST,
      ],
    }),

    getStockRequestDetails: build.query({
      query: ({ id, params }) => {
        return {
          url: `${STOCK_REQUEST}/show/${id}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { id }) => [{ type: STOCK_REQUEST, id }],
    }),

    createStockRequest: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${STOCK_REQUEST}/store`,
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
        return result ? [{ type: STOCK_REQUEST }] : [];
      },
    }),

    updateStockRequest: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `/${STOCK_REQUEST}/update/${id}`,
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
      invalidatesTags: (result) => {
        return result ? [{ type: STOCK_REQUEST }] : [];
      },
    }),

    updateStockRequestStatus: build.mutation({
      query: (id) => {
        return {
          url: `/${STOCK_REQUEST}/status/${id}`,
          method: "POST",
        };
      },
      transformResponse: (response) => {
        if (response?.success) {
          openNotification("success", response?.message);
          return response;
        }
      },
      invalidatesTags: (result) => {
        return result ? [{ type: STOCK_REQUEST }] : [];
      },
    }),

    deleteStockRequest: build.mutation({
      query: (id) => {
        return {
          url: `/${STOCK_REQUEST}/delete/${id}`,
          method: "DELETE",
        };
      },
      transformResponse: (response) => {
        if (response?.success) {
          openNotification("success", response?.message);
          return response;
        }
      },
      invalidatesTags: (result) => {
        return result ? [{ type: STOCK_REQUEST }] : [];
      },
    }),
  }),
});

export const {
  useGetAllStockRequestQuery,
  useGetStockRequestDetailsQuery,
  useCreateStockRequestMutation,
  useUpdateStockRequestMutation,
  useUpdateStockRequestStatusMutation,
  useDeleteStockRequestMutation,
} = stockRequestApi;
