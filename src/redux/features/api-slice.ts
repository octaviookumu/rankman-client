import { PollDBData } from "@/app/types/poll-interfaces";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseApiUrl = `http://${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}`;

// API endpoint for fetching data
export const pollApi = createApi({
  reducerPath: "pollApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/poll/create",
  }),

  endpoints: (builder) => ({
    // <Type of data the call will return, Type of parameter being passed to the query function>
    createPoll: builder.query<any, PollDBData>({
      query: () => "poll",
    }),
  }),
});

export const { useCreatePollQuery } = pollApi;
