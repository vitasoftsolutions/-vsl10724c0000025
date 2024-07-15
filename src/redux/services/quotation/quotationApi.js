// Import necessary dependencies
import { GENERATE_QUOTATION } from "../../../utilities/apiEndpoints/generate.api";
import { openNotification } from "../../../utilities/lib/openToaster";
import { verifyToken } from "../../../utilities/lib/verifyToken";
import { baseApi } from "../../api/baseApi";

const quotationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllQuotation: build.query({
      query: ({ params }) => ({
        url: `/${GENERATE_QUOTATION}`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [
        { type: GENERATE_QUOTATION, ...params },
        GENERATE_QUOTATION,
      ],
    }),

    getQuotationDetails: build.query({
      query: ({ id, params }) => {
        return {
          url: `${GENERATE_QUOTATION}/show/${id}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { id }) => [
        { type: GENERATE_QUOTATION, id },
      ],
    }),

    createQuotation: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${GENERATE_QUOTATION}/store`,
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
        return result ? [{ type: GENERATE_QUOTATION }] : [];
      },
    }),

    updateQuotation: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `/${GENERATE_QUOTATION}/update/${id}`,
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
        return result ? [{ type: GENERATE_QUOTATION }] : [];
      },
    }),

    updateQuotationStatus: build.mutation({
      query: (id) => {
        return {
          url: `/${GENERATE_QUOTATION}/status/${id}`,
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
        return result ? [{ type: GENERATE_QUOTATION }] : [];
      },
    }),

    deleteQuotation: build.mutation({
      query: (id) => {
        return {
          url: `/${GENERATE_QUOTATION}/delete/${id}`,
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
        return result ? [{ type: GENERATE_QUOTATION }] : [];
      },
    }),
  }),
});

export const {
  useGetAllQuotationQuery,
  useGetQuotationDetailsQuery,
  useCreateQuotationMutation,
  useUpdateQuotationMutation,
  useUpdateQuotationStatusMutation,
  useDeleteQuotationMutation,
} = quotationApi;
