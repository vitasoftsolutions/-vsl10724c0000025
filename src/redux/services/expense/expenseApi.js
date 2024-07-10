import { EXPENSE } from "../../../utilities/apiEndpoints/account.api";
import { openNotification } from "../../../utilities/lib/openToaster";
import { verifyToken } from "../../../utilities/lib/verifyToken";
import { baseApi } from "../../api/baseApi";

const expenseApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllExpense: build.query({
      query: ({ params }) => {
        return {
          url: `/${EXPENSE}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [
        { type: EXPENSE, params },
        EXPENSE,
      ],
    }),

    getExpenseDetails: build.query({
      query: ({ id }) => {
        return {
          url: `${EXPENSE}/show/${id}`,
          method: "GET",
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { id }) => [{ type: EXPENSE, id }],
    }),

    createExpense: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${EXPENSE}/store`,
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
        return result ? [EXPENSE] : [];
      },
    }),

    updateExpense: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `/${EXPENSE}/update/${id}`,
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
        return result ? [EXPENSE] : [];
      },
    }),

    updateExpenseStatus: build.mutation({
      query: (id) => {
        return {
          url: `/${EXPENSE}/status/${id}`,
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
        return result ? [EXPENSE] : [];
      },
    }),

    deleteExpense: build.mutation({
      query: (id) => {
        return {
          url: `/${EXPENSE}/delete/${id}`,
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
        return result ? [EXPENSE] : [];
      },
    }),
  }),
});

export const {
  useGetAllExpenseQuery,
  useGetExpenseDetailsQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useUpdateExpenseStatusMutation,
  useDeleteExpenseMutation,
} = expenseApi;
