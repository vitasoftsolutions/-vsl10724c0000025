import { TYPE } from "../../../utilities/apiEndpoints/helper.api";
import {
  transformErrorResponse,
  transformResponse,
} from "../../../utilities/lib/handleResponse";
import { verifyToken } from "../../../utilities/lib/verifyToken";
import { baseApi } from "../../api/baseApi";

const typesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTypes: build.query({
      query: ({ params }) => {
        return {
          url: `/${TYPE}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      transformErrorResponse,
      providesTags: (result, error, { params }) => [
        { type: TYPE, params },
        TYPE,
      ],
    }),
    createType: build.mutation({
      query: ({ data }) => {
        return {
          url: `/${TYPE}/store`,
          method: "POST",
          body: data,
        };
      },
      transformResponse: transformResponse,
      transformErrorResponse: transformErrorResponse,
      invalidatesTags: (result) => {
        return result ? [TYPE] : [];
      },
    }),
    deleteType: build.mutation({
      query: (id) => {
        return {
          url: `/${TYPE}/delete/${id}`,
          method: "DELETE",
        };
      },
      transformResponse: transformResponse,
      invalidatesTags: (result) => {
        return result ? [TYPE] : [];
      },
    }),
  }),
});

export const {
  useGetTypesQuery,
  useCreateTypeMutation,
  useDeleteTypeMutation,
} = typesApi;
