// Import necessary dependencies
import { PURCHASE_RETURN } from "../../../utilities/apiEndpoints/inventory.api";
import { openNotification } from "../../../utilities/lib/openToaster";
import { verifyToken } from "../../../utilities/lib/verifyToken";
import { baseApi } from "../../api/baseApi";

const purchaseReturnApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllPurchaseReturn: build.query({
      query: ({ params }) => ({
        url: `/${PURCHASE_RETURN}`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [
        { type: PURCHASE_RETURN, params },
        PURCHASE_RETURN,
      ],
    }),

    getPurchaseReturnDetails: build.query({
      query: ({ id, params }) => {
        return {
          url: `${PURCHASE_RETURN}/show/${id}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { id }) => [{ type: PURCHASE_RETURN, id }],
    }),

    createPurchaseReturn: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${PURCHASE_RETURN}/store`,
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
        return result ? [PURCHASE_RETURN] : [];
      },
    }),

    updatePurchaseReturn: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `/${PURCHASE_RETURN}/update/${id}`,
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
        return result ? [PURCHASE_RETURN] : [];
      },
    }),

    updatePurchaseReturnStatus: build.mutation({
      query: (id) => {
        return {
          url: `/${PURCHASE_RETURN}/status/${id}`,
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
        return result ? [PURCHASE_RETURN] : [];
      },
    }),

    deletePurchaseReturn: build.mutation({
      query: (id) => {
        return {
          url: `/${PURCHASE_RETURN}/delete/${id}`,
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
        return result ? [PURCHASE_RETURN] : [];
      },
    }),

    checkReference: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${PURCHASE_RETURN}/reference`,
          method: "POST",
          body: data,
        };
      },
    }),

    exportPurchaseReturn: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${PURCHASE_RETURN}/export`,
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
  useGetAllPurchaseReturnQuery,
  useGetPurchaseReturnDetailsQuery,
  useCreatePurchaseReturnMutation,
  useUpdatePurchaseReturnMutation,
  useUpdatePurchaseReturnStatusMutation,
  useDeletePurchaseReturnMutation,
  useExportPurchaseReturnMutation,
  useCheckReferenceMutation,
} = purchaseReturnApi;
