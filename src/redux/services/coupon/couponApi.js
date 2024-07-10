// Import necessary dependencies
import { COUPON } from "../../../utilities/apiEndpoints/offer.api";
import { openNotification } from "../../../utilities/lib/openToaster";
import { verifyToken } from "../../../utilities/lib/verifyToken";
import { baseApi } from "../../api/baseApi";

const couponApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllCoupon: build.query({
      query: ({ params }) => ({
        url: `/${COUPON}`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [
        { type: COUPON, params },
        COUPON,
      ],
    }),

    getCouponDetails: build.query({
      query: ({ id }) => {
        return {
          url: `${COUPON}/show/${id}`,
          method: "GET",
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { id }) => [{ type: COUPON, id }],
    }),

    createCoupon: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${COUPON}/store`,
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
        return result ? [COUPON] : [];
      },
    }),

    updateCoupon: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `/${COUPON}/update/${id}`,
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
        return result ? [COUPON] : [];
      },
    }),

    updateCouponStatus: build.mutation({
      query: (id) => {
        return {
          url: `/${COUPON}/status/${id}`,
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
        return result ? [COUPON] : [];
      },
    }),

    deleteCoupon: build.mutation({
      query: (id) => {
        return {
          url: `/${COUPON}/delete/${id}`,
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
        return result ? [COUPON] : [];
      },
    }),
  }),
});

export const {
  useGetAllCouponQuery,
  useGetCouponDetailsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useUpdateCouponStatusMutation,
  useDeleteCouponMutation,
} = couponApi;
