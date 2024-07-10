// Import necessary dependencies
import { SALE_RETURN } from "../../../utilities/apiEndpoints/inventory.api";
import { openNotification } from "../../../utilities/lib/openToaster";
import { verifyToken } from "../../../utilities/lib/verifyToken";
import { baseApi } from "../../api/baseApi";

const saleReturnApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllSaleReturn: build.query({
      query: ({ params }) => ({
        url: `/${SALE_RETURN}`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [
        { type: SALE_RETURN, params },
        SALE_RETURN,
      ],
    }),

    getSaleReturnDetails: build.query({
      query: ({ id, params }) => {
        return {
          url: `${SALE_RETURN}/show/${id}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { id }) => [{ type: SALE_RETURN, id }],
    }),

    createSaleReturn: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${SALE_RETURN}/store`,
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
        return result ? [SALE_RETURN] : [];
      },
    }),

    updateSaleReturn: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `/${SALE_RETURN}/update/${id}`,
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
        return result ? [SALE_RETURN] : [];
      },
    }),

    updateSaleReturnStatus: build.mutation({
      query: (id) => {
        return {
          url: `/${SALE_RETURN}/status/${id}`,
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
        return result ? [SALE_RETURN] : [];
      },
    }),

    deleteSaleReturn: build.mutation({
      query: (id) => {
        return {
          url: `/${SALE_RETURN}/delete/${id}`,
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
        return result ? [SALE_RETURN] : [];
      },
    }),

    checkSaleReference: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${SALE_RETURN}/reference`,
          method: "POST",
          body: data,
        };
      },
    }),

    exportSaleReturn: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${SALE_RETURN}/export`,
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
  useGetAllSaleReturnQuery,
  useGetSaleReturnDetailsQuery,
  useCreateSaleReturnMutation,
  useUpdateSaleReturnMutation,
  useUpdateSaleReturnStatusMutation,
  useDeleteSaleReturnMutation,
  useCheckSaleReferenceMutation,
  useExportSaleReturnMutation,
} = saleReturnApi;
