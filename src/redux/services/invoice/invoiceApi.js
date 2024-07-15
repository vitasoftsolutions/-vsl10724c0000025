// Import necessary dependencies
import { GENERATE_INVOICE } from "../../../utilities/apiEndpoints/generate.api";
import { openNotification } from "../../../utilities/lib/openToaster";
import { verifyToken } from "../../../utilities/lib/verifyToken";
import { baseApi } from "../../api/baseApi";

const invoiceApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllInvoice: build.query({
      query: ({ params }) => ({
        url: `/${GENERATE_INVOICE}`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [
        { type: GENERATE_INVOICE, ...params },
        GENERATE_INVOICE,
      ],
    }),

    getInvoiceDetails: build.query({
      query: ({ id, params }) => {
        return {
          url: `${GENERATE_INVOICE}/show/${id}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { id }) => [{ type: GENERATE_INVOICE, id }],
    }),

    createInvoice: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${GENERATE_INVOICE}/store`,
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
        return result ? [{ type: GENERATE_INVOICE }] : [];
      },
    }),

    updateInvoice: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `/${GENERATE_INVOICE}/update/${id}`,
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
        return result ? [{ type: GENERATE_INVOICE }] : [];
      },
    }),

    updateInvoiceStatus: build.mutation({
      query: (id) => {
        return {
          url: `/${GENERATE_INVOICE}/status/${id}`,
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
        return result ? [{ type: GENERATE_INVOICE }] : [];
      },
    }),

    deleteInvoice: build.mutation({
      query: (id) => {
        return {
          url: `/${GENERATE_INVOICE}/delete/${id}`,
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
        return result ? [{ type: GENERATE_INVOICE }] : [];
      },
    }),
  }),
});

export const {
  useGetAllInvoiceQuery,
  useGetInvoiceDetailsQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useUpdateInvoiceStatusMutation,
  useDeleteInvoiceMutation,
} = invoiceApi;
