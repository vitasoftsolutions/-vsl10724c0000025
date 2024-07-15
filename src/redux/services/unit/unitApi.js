// Import necessary dependencies
import { UNIT } from "../../../utilities/apiEndpoints/helper.api";
import { openNotification } from "../../../utilities/lib/openToaster";
import { verifyToken } from "../../../utilities/lib/verifyToken";
import { baseApi } from "../../api/baseApi";

const unitApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllUnit: build.query({
      query: ({ params }) => ({
        url: `/${UNIT}`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [
        { type: UNIT, ...params },
        UNIT,
      ],
    }),

    getUnitDetails: build.query({
      query: ({ id, params }) => {
        return {
          url: `${UNIT}/show/${id}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { id }) => [{ type: UNIT, id }],
    }),

    createUnit: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${UNIT}/store`,
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
        return result ? [{ type: UNIT }] : [];
      },
    }),

    updateUnit: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `/${UNIT}/update/${id}`,
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
        return result ? [{ type: UNIT }] : [];
      },
    }),

    updateUnitStatus: build.mutation({
      query: (id) => {
        return {
          url: `/${UNIT}/status/${id}`,
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
        return result ? [{ type: UNIT }] : [];
      },
    }),

    deleteUnit: build.mutation({
      query: (id) => {
        return {
          url: `/${UNIT}/delete/${id}`,
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
        return result ? [{ type: UNIT }] : [];
      },
    }),
  }),
});

export const {
  useGetAllUnitQuery,
  useGetUnitDetailsQuery,
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useUpdateUnitStatusMutation,
  useDeleteUnitMutation,
} = unitApi;
