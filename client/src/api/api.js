import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ 
        baseUrl: "http://localhost:5000/",
        // baseUrl: "http://localhost:5000" ,
        prepareHeaders: (headers) => {
            const user = localStorage.getItem("user");
            const token = JSON.parse(user)?.token;
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['auth'],
    endpoints: () => ({}),
});

