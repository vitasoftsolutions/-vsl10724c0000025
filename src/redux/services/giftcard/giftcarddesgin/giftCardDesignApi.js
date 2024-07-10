// Import necessary dependencies
import { GIFT_CARD_DESIGN } from "../../../../utilities/apiEndpoints/offer.api";
import { openNotification } from "../../../../utilities/lib/openToaster";
import { verifyToken } from "../../../../utilities/lib/verifyToken";
import { baseApi } from "../../../api/baseApi";

const giftCardDesignApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllGiftCardDesign: build.query({
      query: ({ params }) => ({
        url: `/${GIFT_CARD_DESIGN}`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [
        { type: GIFT_CARD_DESIGN, params },
        GIFT_CARD_DESIGN,
      ],
    }),

    getGiftCardDesignDetails: build.query({
      query: ({ id, params }) => {
        return {
          url: `${GIFT_CARD_DESIGN}/show/${id}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { id }) => [{ type: GIFT_CARD_DESIGN, id }],
    }),

    createGiftCardDesign: build.mutation({
      query: ({ formData }) => {
        return {
          url: `/${GIFT_CARD_DESIGN}/store`,
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
        return result ? [GIFT_CARD_DESIGN] : [];
      },
    }),

    updateGiftCardDesign: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `/${GIFT_CARD_DESIGN}/update/${id}`,
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
        return result ? [GIFT_CARD_DESIGN] : [];
      },
    }),

    updateGiftCardDesignStatus: build.mutation({
      query: (id) => {
        return {
          url: `/${GIFT_CARD_DESIGN}/status/${id}`,
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
        return result ? [GIFT_CARD_DESIGN] : [];
      },
    }),

    deleteGiftCardDesign: build.mutation({
      query: (id) => {
        return {
          url: `/${GIFT_CARD_DESIGN}/delete/${id}`,
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
        return result ? [GIFT_CARD_DESIGN] : [];
      },
    }),
  }),
});

export const {
  useGetAllGiftCardDesignQuery,
  useGetGiftCardDesignDetailsQuery,
  useCreateGiftCardDesignMutation,
  useUpdateGiftCardDesignMutation,
  useUpdateGiftCardDesignStatusMutation,
  useDeleteGiftCardDesignMutation,
} = giftCardDesignApi;
