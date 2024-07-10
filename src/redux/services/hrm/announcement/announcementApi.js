// Import necessary dependencies
import { ANNOUNCEMENT } from "../../../../utilities/apiEndpoints/hrm.api";
import { openNotification } from "../../../../utilities/lib/openToaster";
import { verifyToken } from "../../../../utilities/lib/verifyToken";
import { baseApi } from "../../../api/baseApi";

const announcementApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllAnnouncement: build.query({
      query: ({ params }) => ({
        url: `/${ANNOUNCEMENT}`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [
        { type: ANNOUNCEMENT, params },
        ANNOUNCEMENT,
      ],
    }),

    getAnnouncementDetails: build.query({
      query: ({ id, params }) => {
        return {
          url: `${ANNOUNCEMENT}/show/${id}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { id }) => [{ type: ANNOUNCEMENT, id }],
    }),

    createAnnouncement: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${ANNOUNCEMENT}/store`,
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
        return result ? [ANNOUNCEMENT] : [];
      },
    }),

    updateAnnouncement: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `/${ANNOUNCEMENT}/update/${id}`,
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
        return result ? [ANNOUNCEMENT] : [];
      },
    }),

    updateAnnouncementStatus: build.mutation({
      query: (id) => {
        return {
          url: `/${ANNOUNCEMENT}/status/${id}`,
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
        return result ? [ANNOUNCEMENT] : [];
      },
    }),

    deleteAnnouncement: build.mutation({
      query: (id) => {
        return {
          url: `/${ANNOUNCEMENT}/delete/${id}`,
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
        return result ? [ANNOUNCEMENT] : [];
      },
    }),

    exportAnnouncement: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${ANNOUNCEMENT}/export`,
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
  useGetAllAnnouncementQuery,
  useGetAnnouncementDetailsQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useUpdateAnnouncementStatusMutation,
  useDeleteAnnouncementMutation,
  useExportAnnouncementMutation,
} = announcementApi;
