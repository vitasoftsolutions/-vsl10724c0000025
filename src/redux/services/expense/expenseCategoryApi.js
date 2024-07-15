import { EXPENSE_CATEGORY } from "../../../utilities/apiEndpoints/account.api";
import { openNotification } from "../../../utilities/lib/openToaster";
import { verifyToken } from "../../../utilities/lib/verifyToken";
import { baseApi } from "../../api/baseApi";

const expenseCategoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllExpenseCategory: build.query({
      query: ({ params }) => {
        return {
          url: `/${EXPENSE_CATEGORY}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { params }) => [
        { type: EXPENSE_CATEGORY, ...params },
        EXPENSE_CATEGORY,
      ],
    }),

    getExpenseCategoryDetails: build.query({
      query: ({ id }) => {
        return {
          url: `${EXPENSE_CATEGORY}/show/${id}`,
          method: "GET",
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { id }) => [{ type: EXPENSE_CATEGORY, id }],
    }),

    createExpenseCategory: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${EXPENSE_CATEGORY}/store`,
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
        return result ? [{ type: EXPENSE_CATEGORY }] : [];
      },
    }),

    updateExpenseCategory: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `/${EXPENSE_CATEGORY}/update/${id}`,
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
        return result ? [{ type: EXPENSE_CATEGORY }] : [];
      },
    }),

    updateExpenseCategoryStatus: build.mutation({
      query: (id) => {
        return {
          url: `/${EXPENSE_CATEGORY}/status/${id}`,
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
        return result ? [{ type: EXPENSE_CATEGORY }] : [];
      },
    }),

    deleteExpenseCategory: build.mutation({
      query: (id) => {
        return {
          url: `/${EXPENSE_CATEGORY}/delete/${id}`,
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
        return result ? [{ type: EXPENSE_CATEGORY }] : [];
      },
    }),
  }),
});

export const {
  useGetAllExpenseCategoryQuery,
  useGetExpenseCategoryDetailsQuery,
  useCreateExpenseCategoryMutation,
  useUpdateExpenseCategoryMutation,
  useUpdateExpenseCategoryStatusMutation,
  useDeleteExpenseCategoryMutation,
} = expenseCategoryApi;
