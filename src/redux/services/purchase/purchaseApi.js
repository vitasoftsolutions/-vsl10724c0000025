// Import necessary dependencies
import { PURCHASE } from "../../../utilities/apiEndpoints/inventory.api";
import { openNotification } from "../../../utilities/lib/openToaster";
import { verifyToken } from "../../../utilities/lib/verifyToken";
import { baseApi } from "../../api/baseApi";

const purchaseApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllPurchase: build.query({
      query: ({ params }) => ({
        url: `/${PURCHASE}`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [
        { type: PURCHASE, params },
        PURCHASE,
      ],
    }),

    getPurchaseDetails: build.query({
      query: ({ id, params }) => {
        return {
          url: `${PURCHASE}/show/${id}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { id }) => [{ type: PURCHASE, id }],
    }),

    createPurchase: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${PURCHASE}/store`,
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
        return result ? [PURCHASE] : [];
      },
    }),

    updatePurchase: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `/${PURCHASE}/update/${id}`,
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
        return result ? [PURCHASE] : [];
      },
    }),

    updatePurchaseStatus: build.mutation({
      query: (id) => {
        return {
          url: `/${PURCHASE}/status/${id}`,
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
        return result ? [PURCHASE] : [];
      },
    }),

    deletePurchase: build.mutation({
      query: (id) => {
        return {
          url: `/${PURCHASE}/delete/${id}`,
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
        return result ? [PURCHASE] : [];
      },
    }),

    exportPurchase: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${PURCHASE}/export`,
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
  useGetAllPurchaseQuery,
  useGetPurchaseDetailsQuery,
  useCreatePurchaseMutation,
  useUpdatePurchaseMutation,
  useUpdatePurchaseStatusMutation,
  useDeletePurchaseMutation,
  useExportPurchaseMutation,
} = purchaseApi;
