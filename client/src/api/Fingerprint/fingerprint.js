
import { api } from "../api";

export const fingerprintApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint pour récupérer tous les fingerprints de l'utilisateur
    getfingerprints: builder.query({
      query: () => ({
        url: "fingerprint/get",
        method: "GET",
      }),
    }),

    //Endpoint pour recuperer id du fingerprint
    getfingerprintById: builder.query({
      query: (id) => ({
        url: `fingerprint/${id}`,
        method: "GET",

      }),
    }),

    // Endpoint pour créer un nouveau fingerprint
    createfingerprint: builder.mutation({
      query: (body) => ({
        url: "fingerprint/create",
        method: "POST",
        body,
      }),
      // Lorsqu'un nouveau fingerprint est créé, invalider le cache des fingerprints pour forcer la mise à jour de la liste des fingerprints
      invalidatesTags: ["fingerprints"],
    }),

    // Endpoint pour supprimer un fingerprint
    deletefingerprint: builder.mutation({
      query: (id) => ({
        url: `fingerprint/delete/${id}`,
        method: "DELETE",
      }),
      // Lorsqu'un fingerprint est supprimé, invalider le cache des fingerprints pour forcer la mise à jour de la liste des fingerprints
      invalidatesTags: ["fingerprints"],
    }),

    // Endpoint pour mettre à jour un fingerprint
    updatefingerprint: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `fingerprint/update/${id}`,
        method: "PATCH",
        body: updatedData,
      }),
      // Lorsqu'un fingerprint est mis à jour, invalider le cache des fingerprints pour forcer la mise à jour de la liste des fingerprints
      invalidatesTags: ["fingerprints"],
    }),
    countfingerprint: builder.query({
      query: (body) => ({
        url: "fingerprint/count/get",
        method: "GET",
      }),
      invalidatesTags: ["fingerprints"],
    }),
  }),
});

// Exportez les hooks d'action générés par l'API
export const {
  useGetfingerprintsQuery,
  useCreatefingerprintMutation,
  useDeletefingerprintMutation,
  useUpdatefingerprintMutation,
  useGetfingerprintByIdQuery,
  useCountfingerprintQuery,
  
} = fingerprintApi;
