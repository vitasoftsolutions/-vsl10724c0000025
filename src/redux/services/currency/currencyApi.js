import { CURRENCY } from "../../../utilities/apiEndpoints/helper.api";
import { openNotification } from "../../../utilities/lib/openToaster";
import { verifyToken } from "../../../utilities/lib/verifyToken";
import { baseApi } from "../../api/baseApi";

const currencyApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllCurrency: build.query({
      query: ({ params }) => {
        return {
          url: `/${CURRENCY}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [
        { type: CURRENCY, ...params },
        CURRENCY,
      ],
    }),
    createCurrency: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${CURRENCY}/store`,
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
        return result ? [{ type: CURRENCY }] : [];
      },
    }),
    updateCurrencyDefault: build.mutation({
      query: (id) => {
        return {
          url: `/${CURRENCY}/default/${id}`,
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
        return result ? [{ type: CURRENCY }] : [];
      },
    }),
    deleteCurrency: build.mutation({
      query: (id) => {
        return {
          url: `/${CURRENCY}/delete/${id}`,
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
        return result ? [{ type: CURRENCY }] : [];
      },
    }),
  }),
});

export const {
  useGetAllCurrencyQuery,
  useCreateCurrencyMutation,
  useDeleteCurrencyMutation,
  useUpdateCurrencyDefaultMutation,
} = currencyApi;
