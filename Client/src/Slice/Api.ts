// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


// Define a service using a base URL and expected endpoints
export const apiSlite = createApi({
  reducerPath: 'apiSlite',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api' }),
  endpoints: (build) => ({
    getAllTable: build.query({
  query: (people) => ({
    url: `getTable?people=${people}`,
    method: 'GET',
  }),
}),
    // you can add more endpoints here later
  }),
})

// Export the generated hook
export const { useGetAllTableQuery } = apiSlite;