// Import necessary dependencies
import { HOLIDAY } from "../../../../utilities/apiEndpoints/hrm.api";
import { openNotification } from "../../../../utilities/lib/openToaster";
import { verifyToken } from "../../../../utilities/lib/verifyToken";
import { baseApi } from "../../../api/baseApi";

const holidayApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllHoliday: build.query({
      query: ({ params }) => ({
        url: `/${HOLIDAY}`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [
        { type: HOLIDAY, ...params },
        HOLIDAY,
      ],
    }),

    getHolidayDetails: build.query({
      query: ({ id, params }) => {
        return {
          url: `${HOLIDAY}/show/${id}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { id }) => [{ type: HOLIDAY, id }],
    }),

    createHoliday: build.mutation({
      query: ({ formData }) => {
        return {
          url: `/${HOLIDAY}/store`,
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
        return result ? [{ type: HOLIDAY }] : [];
      },
    }),

    updateHoliday: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `/${HOLIDAY}/update/${id}`,
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
        return result ? [{ type: HOLIDAY }] : [];
      },
    }),

    updateHolidayStatus: build.mutation({
      query: (id) => {
        return {
          url: `/${HOLIDAY}/status/${id}`,
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
        return result ? [{ type: HOLIDAY }] : [];
      },
    }),

    deleteHoliday: build.mutation({
      query: (id) => {
        return {
          url: `/${HOLIDAY}/delete/${id}`,
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
        return result ? [{ type: HOLIDAY }] : [];
      },
    }),

    exportHoliday: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${HOLIDAY}/export`,
          method: "GET",
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
    }),
  }),
});

export const {
  useGetAllHolidayQuery,
  useGetHolidayDetailsQuery,
  useCreateHolidayMutation,
  useUpdateHolidayMutation,
  useUpdateHolidayStatusMutation,
  useDeleteHolidayMutation,
  useExportHolidayMutation,
} = holidayApi;
