// import { api } from "./api";

// export const authApi = api.injectEndpoints({
//   endpoints: (builder) => ({
//     login: builder.mutation({
//       query: (body) => ({
//         url: "auth/login",
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: ["auth"],
//     }),
//     register: builder.mutation({
//       query: (body) => ({
//         url: "auth/register",
//         method: "POST",
//         body,
//       }),
//     }),
//     forgotPassword: builder.mutation({
//       query: (body) => ({
//         url: "auth/forgotpassword",
//         method: "POST",
//         body,
//       }),
//     }),
//     count: builder.query({
//       query: (body) => ({
//         url: "auth/count/get",
//         method: "GET",
//       }),
//       invalidatesTags: ["auth"],
//     }),
 
//   }),
// });

// export const { useLoginMutation,useForgotPasswordMutation, useRegisterMutation, useCountQuery } = authApi;


// // auth.js
import { api } from "./api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: "auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["auth"],
    }),
    register: builder.mutation({
      query: (body) => ({
        url: "auth/register",
        method: "POST",
        body,
      }),
    }),
    
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: "auth/forgotpassword",
        method: "POST",
        body,
      }),
    }),
    
    validate: builder.mutation({
      query: (body) => ({
          url: "auth/validation",
          method: "PATCH",
          body,
      }),
    }),
    validateCode: builder.mutation({
      query: (body) => ({
          url: "auth/validatecode",
          method: "PATCH",
          body,
      }),
    }),
    count: builder.query({
      query: () => ({
        url: "auth/count",
        method: "GET",
      }),
    }),
  }),
});

// Exports des hooks pour utiliser les mutations
export const {
  useLoginMutation,
  useRegisterMutation,
  validateCode,
  useValidateMutation,
  useForgotPasswordMutation,
  useCountQuery,
} = authApi;