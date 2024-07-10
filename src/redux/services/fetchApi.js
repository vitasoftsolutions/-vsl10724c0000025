import { verifyToken } from "../../utilities/lib/verifyToken";
import { baseApi } from "../api/baseApi";

const fetchApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllData: build.query({
      query: ({ url, params }) => {
        return {
          url: `/${url}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { url }) => [url],
    }),
    handleEdit: build.query({
      query: ({ url, id }) => {
        //console.log(url, id);
        return {
          url: `${url}/show/${id}`,
          method: "GET",
        };
      },
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, error, { url }) => [url],
    }),
  }),
});

export const { useGetAllDataQuery, useGetDetailsQuery } = fetchApi;
