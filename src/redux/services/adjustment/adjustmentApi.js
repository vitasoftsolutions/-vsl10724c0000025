import { ADJUSTMENT } from "../../../utilities/apiEndpoints/inventory.api";
import { openNotification } from "../../../utilities/lib/openToaster";
import { verifyToken } from "../../../utilities/lib/verifyToken";
import { baseApi } from "../../api/baseApi";

const adjustmentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllAdjustment: build.query({
      query: ({ params }) => {
        return {
          url: `/${ADJUSTMENT}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [
        { type: ADJUSTMENT, ...params },
        ADJUSTMENT,
      ],
    }),

    getAdjustmentDetails: build.query({
      query: ({ id, params }) => {
        return {
          url: `${ADJUSTMENT}/show/${id}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: [ADJUSTMENT],
    }),

    createAdjustment: build.mutation({
      query: ({ formData }) => {
        return {
          url: `/${ADJUSTMENT}/store`,
          method: "POST",
          body: formData,
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
        return result ? [{ type: ADJUSTMENT }] : [];
      },
    }),

    updateAdjustment: build.mutation({
      query: ({ id, formData }) => {
        return {
          url: `/${ADJUSTMENT}/update/${id}`,
          method: "PUT",
          body: formData,
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
        return result ? [{ type: ADJUSTMENT }] : [];
      },
    }),

    updateAdjustmentStatus: build.mutation({
      query: (id) => {
        return {
          url: `/${ADJUSTMENT}/status/${id}`,
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
        return result ? [{ type: ADJUSTMENT }] : [];
      },
    }),

    deleteAdjustment: build.mutation({
      query: (id) => {
        return {
          url: `/${ADJUSTMENT}/delete/${id}`,
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
        return result ? [{ type: ADJUSTMENT }] : [];
      },
    }),
  }),
});

export const {
  useGetAllAdjustmentQuery,
  useGetAdjustmentDetailsQuery,
  useCreateAdjustmentMutation,
  useUpdateAdjustmentMutation,
  useUpdateAdjustmentStatusMutation,
  useDeleteAdjustmentMutation,
} = adjustmentApi;
