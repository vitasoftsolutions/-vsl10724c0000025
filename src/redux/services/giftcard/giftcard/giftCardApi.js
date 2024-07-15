// Import necessary dependencies
import { GIFT_CARD } from "../../../../utilities/apiEndpoints/offer.api";
import { openNotification } from "../../../../utilities/lib/openToaster";
import { verifyToken } from "../../../../utilities/lib/verifyToken";
import { baseApi } from "../../../api/baseApi";

const giftCardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllGiftCard: build.query({
      query: ({ params }) => ({
        url: `/${GIFT_CARD}`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [
        { type: GIFT_CARD, params },
        GIFT_CARD,
      ],
    }),

    getGiftCardDetails: build.query({
      query: ({ id, params }) => {
        return {
          url: `${GIFT_CARD}/show/${id}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { id }) => [{ type: GIFT_CARD, id }],
    }),

    createGiftCard: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${GIFT_CARD}/store`,
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
        return result ? [{ type: GIFT_CARD }] : [];
      },
    }),

    updateGiftCard: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `/${GIFT_CARD}/update/${id}`,
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
        return result ? [{ type: GIFT_CARD }] : [];
      },
    }),

    updateGiftCardStatus: build.mutation({
      query: (id) => {
        return {
          url: `/${GIFT_CARD}/status/${id}`,
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
        return result ? [{ type: GIFT_CARD }] : [];
      },
    }),

    deleteGiftCard: build.mutation({
      query: (id) => {
        return {
          url: `/${GIFT_CARD}/delete/${id}`,
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
        return result ? [{ type: GIFT_CARD }] : [];
      },
    }),
  }),
});

export const {
  useGetAllGiftCardQuery,
  useGetGiftCardDetailsQuery,
  useCreateGiftCardMutation,
  useUpdateGiftCardMutation,
  useUpdateGiftCardStatusMutation,
  useDeleteGiftCardMutation,
} = giftCardApi;
