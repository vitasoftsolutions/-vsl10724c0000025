// Import necessary dependencies
import { SALE } from "../../../utilities/apiEndpoints/inventory.api";
import { openNotification } from "../../../utilities/lib/openToaster";
import { verifyToken } from "../../../utilities/lib/verifyToken";
import { baseApi } from "../../api/baseApi";

const saleApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllSale: build.query({
      query: ({ params }) => ({
        url: `/${SALE}`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [
        { type: SALE, ...params },
        SALE,
      ],
    }),

    getSaleDetails: build.query({
      query: ({ id, params }) => {
        return {
          url: `${SALE}/show/${id}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { id }) => [{ type: SALE, id }],
    }),

    createSale: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${SALE}/store`,
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
        return result ? [{ type: SALE }] : [];
      },
    }),

    updateSale: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `/${SALE}/update/${id}`,
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
        return result ? [{ type: SALE }] : [];
      },
    }),

    updateSaleStatus: build.mutation({
      query: (id) => {
        return {
          url: `/${SALE}/status/${id}`,
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
        return result ? [{ type: SALE }] : [];
      },
    }),

    deleteSale: build.mutation({
      query: (id) => {
        return {
          url: `/${SALE}/delete/${id}`,
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
        return result ? [{ type: SALE }] : [];
      },
    }),
  }),
});

export const {
  useGetAllSaleQuery,
  useGetSaleDetailsQuery,
  useCreateSaleMutation,
  useUpdateSaleMutation,
  useUpdateSaleStatusMutation,
  useDeleteSaleMutation,
} = saleApi;
