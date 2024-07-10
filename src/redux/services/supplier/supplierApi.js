import { SUPPLIER } from "../../../utilities/apiEndpoints/people.api";
import { openNotification } from "../../../utilities/lib/openToaster";
import { verifyToken } from "../../../utilities/lib/verifyToken";
import { baseApi } from "../../api/baseApi";

const supplierApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllSupplier: build.query({
      query: ({ params }) => {
        return {
          url: `/${SUPPLIER}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [
        { type: SUPPLIER, params },
        SUPPLIER,
      ],
    }),

    getSupplierDetails: build.query({
      query: ({ id }) => {
        return {
          url: `${SUPPLIER}/show/${id}`,
          method: "GET",
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { id }) => [{ type: SUPPLIER, id }],
    }),

    createSupplier: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${SUPPLIER}/store`,
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
        return result ? [SUPPLIER] : [];
      },
    }),

    updateSupplier: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `/${SUPPLIER}/update/${id}`,
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
        return result ? [SUPPLIER] : [];
      },
    }),

    updateSupplierStatus: build.mutation({
      query: (id) => {
        return {
          url: `/${SUPPLIER}/status/${id}`,
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
        return result ? [SUPPLIER] : [];
      },
    }),

    deleteSupplier: build.mutation({
      query: (id) => {
        return {
          url: `/${SUPPLIER}/delete/${id}`,
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
        return result ? [SUPPLIER] : [];
      },
    }),
  }),
});

export const {
  useGetAllSupplierQuery,
  useGetSupplierDetailsQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useUpdateSupplierStatusMutation,
  useDeleteSupplierMutation,
} = supplierApi;
