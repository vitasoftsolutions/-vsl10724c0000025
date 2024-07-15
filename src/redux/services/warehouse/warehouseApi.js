import { WAREHOUSE } from "../../../utilities/apiEndpoints/inventory.api";
import { openNotification } from "../../../utilities/lib/openToaster";
import { verifyToken } from "../../../utilities/lib/verifyToken";
import { baseApi } from "../../api/baseApi";

const warehouseApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getWarehouses: build.query({
      query: ({ params }) => {
        return {
          url: `/${WAREHOUSE}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [
        { type: WAREHOUSE, ...params },
        WAREHOUSE,
      ],
    }),

    // getWarehouseSelectedDetails: build.query({
    //   query: ({ params }) => {
    //     return {
    //       url: `${WAREHOUSE}`,
    //       method: "GET",
    //       params,
    //     };
    //   },
    //   transformResponse: (response) => verifyToken(response.data),
    //   providesTags: [WAREHOUSE],
    // }),

    getWarehouseDetails: build.query({
      query: ({ id }) => {
        return {
          url: `${WAREHOUSE}/show/${id}`,
          method: "GET",
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: [WAREHOUSE],
    }),

    createWarehouse: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${WAREHOUSE}/store`,
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
        return result ? [{ type: WAREHOUSE }] : [];
      },
    }),

    updateWarehouse: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `/${WAREHOUSE}/update/${id}`,
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
        return result ? [{ type: WAREHOUSE }] : [];
      },
    }),

    updateWarehouseStatus: build.mutation({
      query: (id) => {
        return {
          url: `/${WAREHOUSE}/status/${id}`,
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
        return result ? [{ type: WAREHOUSE }] : [];
      },
    }),

    deleteWarehouse: build.mutation({
      query: (id) => {
        return {
          url: `/${WAREHOUSE}/delete/${id}`,
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
        return result ? [{ type: WAREHOUSE }] : [];
      },
    }),
  }),
});

export const {
  useGetWarehousesQuery,
  // useGetWarehouseSelectedDetailsQuery,
  useGetWarehouseDetailsQuery,
  useCreateWarehouseMutation,
  useUpdateWarehouseMutation,
  useUpdateWarehouseStatusMutation,
  useDeleteWarehouseMutation,
} = warehouseApi;
