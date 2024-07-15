// Import necessary dependencies
import { DESIGNATION } from "../../../../utilities/apiEndpoints/hrm.api";
import { openNotification } from "../../../../utilities/lib/openToaster";
import { verifyToken } from "../../../../utilities/lib/verifyToken";
import { baseApi } from "../../../api/baseApi";

const designationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllDesignation: build.query({
      query: ({ params }) => ({
        url: `/${DESIGNATION}`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [
        { type: DESIGNATION, ...params },
        DESIGNATION,
      ],
    }),

    getDesignationDetails: build.query({
      query: ({ id, params }) => {
        return {
          url: `${DESIGNATION}/show/${id}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { id }) => [{ type: DESIGNATION, id }],
    }),

    createDesignation: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${DESIGNATION}/store`,
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
        return result ? [{ type: DESIGNATION }] : [];
      },
    }),

    updateDesignation: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `/${DESIGNATION}/update/${id}`,
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
        return result ? [{ type: DESIGNATION }] : [];
      },
    }),

    updateDesignationStatus: build.mutation({
      query: (id) => {
        return {
          url: `/${DESIGNATION}/status/${id}`,
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
        return result ? [{ type: DESIGNATION }] : [];
      },
    }),

    deleteDesignation: build.mutation({
      query: (id) => {
        return {
          url: `/${DESIGNATION}/delete/${id}`,
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
        return result ? [{ type: DESIGNATION }] : [];
      },
    }),

    exportDesignation: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${DESIGNATION}/export`,
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
  useGetAllDesignationQuery,
  useGetDesignationDetailsQuery,
  useCreateDesignationMutation,
  useUpdateDesignationMutation,
  useUpdateDesignationStatusMutation,
  useDeleteDesignationMutation,
  useExportDesignationMutation,
} = designationApi;
