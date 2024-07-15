// Import necessary dependencies
import { PRODUCT } from "../../../utilities/apiEndpoints/inventory.api";
import { SUMMARY } from "../../../utilities/apiEndpoints/report.api";
import { verifyToken } from "../../../utilities/lib/verifyToken";
import { baseApi } from "../../api/baseApi";

const summaryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getReportSummary: build.query({
      query: ({ params }) => ({
        url: `/${SUMMARY}`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, err, { params }) => [
        { type: SUMMARY, ...params },
        SUMMARY,
      ],
    }),

    getAlertReport: build.query({
      query: ({ params }) => ({
        url: `/${PRODUCT}`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => verifyToken(response.data),
      providesTags: (result, err, { params }) => [
        { type: PRODUCT, ...params },
        PRODUCT,
      ],
    }),
  }),
});

export const { useGetReportSummaryQuery, useGetAlertReportQuery } = summaryApi;
