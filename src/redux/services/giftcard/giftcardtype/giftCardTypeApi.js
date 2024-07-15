// Import necessary dependencies
import { GIFT_CARD_TYPE } from "../../../../utilities/apiEndpoints/offer.api";
import { openNotification } from "../../../../utilities/lib/openToaster";
import { verifyToken } from "../../../../utilities/lib/verifyToken";
import { baseApi } from "../../../api/baseApi";

const giftCardTypeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllGiftCardType: build.query({
      query: ({ params }) => ({
        url: `/${GIFT_CARD_TYPE}`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [
        { type: GIFT_CARD_TYPE, ...params },
        GIFT_CARD_TYPE,
      ],
    }),

    getGiftCardTypeDetails: build.query({
      query: ({ id }) => {
        return {
          url: `${GIFT_CARD_TYPE}/show/${id}`,
          method: "GET",
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { id }) => [{ type: GIFT_CARD_TYPE, id }],
    }),

    createGiftCardType: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${GIFT_CARD_TYPE}/store`,
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
        return result ? [{ type: GIFT_CARD_TYPE }] : [];
      },
    }),

    updateGiftCardType: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `/${GIFT_CARD_TYPE}/update/${id}`,
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
        return result ? [{ type: GIFT_CARD_TYPE }] : [];
      },
    }),

    updateGiftCardTypeStatus: build.mutation({
      query: (id) => {
        return {
          url: `/${GIFT_CARD_TYPE}/status/${id}`,
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
        return result ? [{ type: GIFT_CARD_TYPE }] : [];
      },
    }),

    deleteGiftCardType: build.mutation({
      query: (id) => {
        return {
          url: `/${GIFT_CARD_TYPE}/delete/${id}`,
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
        return result ? [{ type: GIFT_CARD_TYPE }] : [];
      },
    }),
  }),
});

export const {
  useGetAllGiftCardTypeQuery,
  useGetGiftCardTypeDetailsQuery,
  useCreateGiftCardTypeMutation,
  useUpdateGiftCardTypeMutation,
  useUpdateGiftCardTypeStatusMutation,
  useDeleteGiftCardTypeMutation,
} = giftCardTypeApi;
