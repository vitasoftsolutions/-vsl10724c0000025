import { STOCK_COUNT } from "../../../utilities/apiEndpoints/inventory.api";
import { openNotification } from "../../../utilities/lib/openToaster";
import { verifyToken } from "../../../utilities/lib/verifyToken";
import { baseApi } from "../../api/baseApi";

const stockCountApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getStockCounts: build.query({
      query: ({ params }) => {
        return {
          url: `/${STOCK_COUNT}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [
        { type: STOCK_COUNT, ...params },
        STOCK_COUNT,
      ],
    }),

    getStockCountDetails: build.query({
      query: ({ id, params }) => {
        return {
          url: `${STOCK_COUNT}/show/${id}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: [STOCK_COUNT],
    }),

    createStockCount: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${STOCK_COUNT}/store`,
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
        return result ? [{ type: STOCK_COUNT }] : [];
      },
    }),

    updateStockCount: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `/${STOCK_COUNT}/update/${id}`,
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
        return result ? [{ type: STOCK_COUNT }] : [];
      },
    }),

    updateStockCountStatus: build.mutation({
      query: (id) => {
        return {
          url: `/${STOCK_COUNT}/status/${id}`,
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
        return result ? [{ type: STOCK_COUNT }] : [];
      },
    }),

    deleteStockCount: build.mutation({
      query: (id) => {
        return {
          url: `/${STOCK_COUNT}/delete/${id}`,
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
        return result ? [{ type: STOCK_COUNT }] : [];
      },
    }),
  }),
});

export const {
  useCreateStockCountMutation,
  useGetStockCountsQuery,
  useGetStockCountDetailsQuery,
  useUpdateStockCountMutation,
  useUpdateStockCountStatusMutation,
  useDeleteStockCountMutation,
} = stockCountApi;
