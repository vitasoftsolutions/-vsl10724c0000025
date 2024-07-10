import { TAX } from "../../../utilities/apiEndpoints/helper.api";
import { openNotification } from "../../../utilities/lib/openToaster";
import { verifyToken } from "../../../utilities/lib/verifyToken";
import { baseApi } from "../../api/baseApi";

const taxApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllTax: build.query({
      query: ({ params }) => {
        return {
          url: `/${TAX}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [{ type: TAX, params }, TAX],
    }),
    createTax: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${TAX}/store`,
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
        return result ? [TAX] : [];
      },
    }),
    deleteTax: build.mutation({
      query: (id) => {
        return {
          url: `/${TAX}/delete/${id}`,
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
        return result ? [TAX] : [];
      },
    }),
  }),
});

export const { useGetAllTaxQuery, useCreateTaxMutation, useDeleteTaxMutation } =
  taxApi;
