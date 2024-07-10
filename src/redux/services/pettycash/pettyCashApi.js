// Import necessary dependencies
import { PETTY_CASH } from "../../../utilities/apiEndpoints/account.api";
import { openNotification } from "../../../utilities/lib/openToaster";
import { verifyToken } from "../../../utilities/lib/verifyToken";
import { baseApi } from "../../api/baseApi";

const pettyCashApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllPettyCash: build.query({
      query: ({ params }) => ({
        url: `/${PETTY_CASH}`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [
        { type: PETTY_CASH, params },
        PETTY_CASH,
      ],
    }),

    // getPettyCashDetails: build.query({
    //   query: ({ id }) => {
    //     return {
    //       url: `${PETTY_CASH}/show/${id}`,
    //       method: "GET",
    //     };
    //   },
    //   transformResponse: (response) => verifyToken(response.data),
    //   providesTags: (result, error, { id }) => [{ type: PETTY_CASH, id }],
    // }),

    createPettyCash: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${PETTY_CASH}/store`,
          method: "POST",
          body: data,
        };
      },
      transformResponse: (response) => {
        if (response?.success) {
          // openNotification("success", response?.message);
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
        return result ? [PETTY_CASH] : [];
      },
    }),

    // updatePettyCash: build.mutation({
    //   query: ({ id, data }) => {
    //     return {
    //       url: `/${PETTY_CASH}/update/${id}`,
    //       method: "POST",
    //       body: data,
    //     };
    //   },
    //   transformResponse: (response) => {
    //     if (response?.success) {
    //       openNotification("success", response?.message);
    //       return response;
    //     }
    //   },
    //   invalidatesTags: (result) => {
    //     return result ? [PETTY_CASH] : [];
    //   },
    // }),

    // updatePettyCashStatus: build.mutation({
    //   query: (id) => {
    //     return {
    //       url: `/${PETTY_CASH}/status/${id}`,
    //       method: "POST",
    //     };
    //   },
    //   transformResponse: (response) => {
    //     if (response?.success) {
    //       openNotification("success", response?.message);
    //       return response;
    //     }
    //   },
    //   invalidatesTags: (result) => {
    //     return result ? [PETTY_CASH] : [];
    //   },
    // }),

    deletePettyCash: build.mutation({
      query: (id) => {
        return {
          url: `/${PETTY_CASH}/delete/${id}`,
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
        return result ? [PETTY_CASH] : [];
      },
    }),

    checkPettyCash: build.query({
      query: ({ params }) => ({
        url: `/${PETTY_CASH}/check`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => {
        if (response?.success) {
          // openNotification("success", response?.message);
          return response;
        }
      },
      providesTags: (result, error, { params }) => [
        { type: PETTY_CASH, params },
        PETTY_CASH,
      ],
    }),
  }),
});

export const {
  useGetAllPettyCashQuery,
  // useGetPettyCashDetailsQuery,
  // useUpdatePettyCashMutation,
  // useUpdatePettyCashStatusMutation,
  useDeletePettyCashMutation,
  useCreatePettyCashMutation,
  useCheckPettyCashQuery,
} = pettyCashApi;
