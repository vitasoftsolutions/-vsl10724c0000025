// Import necessary dependencies
import { TRANSFER } from "../../../utilities/apiEndpoints/inventory.api";
import { openNotification } from "../../../utilities/lib/openToaster";
import { verifyToken } from "../../../utilities/lib/verifyToken";
import { baseApi } from "../../api/baseApi";

const transferApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllTransfer: build.query({
      query: ({ params }) => ({
        url: `/${TRANSFER}`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [
        { type: TRANSFER, ...params },
        TRANSFER,
      ],
    }),

    getTransferDetails: build.query({
      query: ({ id, params }) => {
        return {
          url: `${TRANSFER}/show/${id}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { id }) => [{ type: TRANSFER, id }],
    }),

    createTransfer: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${TRANSFER}/store`,
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
        return result ? [{ type: TRANSFER }] : [];
      },
    }),

    updateTransfer: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `/${TRANSFER}/update/${id}`,
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
        return result ? [{ type: TRANSFER }] : [];
      },
    }),

    updateTransferStatus: build.mutation({
      query: (id) => {
        return {
          url: `/${TRANSFER}/status/${id}`,
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
        return result ? [{ type: TRANSFER }] : [];
      },
    }),

    deleteTransfer: build.mutation({
      query: (id) => {
        return {
          url: `/${TRANSFER}/delete/${id}`,
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
        return result ? [{ type: TRANSFER }] : [];
      },
    }),

    exportTransfer: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${TRANSFER}/export`,
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
  useGetAllTransferQuery,
  useGetTransferDetailsQuery,
  useCreateTransferMutation,
  useUpdateTransferMutation,
  useUpdateTransferStatusMutation,
  useDeleteTransferMutation,
  useExportTransferMutation,
} = transferApi;
