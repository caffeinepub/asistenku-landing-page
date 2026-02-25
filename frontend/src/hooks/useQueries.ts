import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import { Role } from "../backend";

// ─── isAdminClaimed ────────────────────────────────────────────────────────
export function useIsAdminClaimed() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ["isAdminClaimed"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isAdminClaimed();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── claimAdmin ────────────────────────────────────────────────────────────
export function useClaimAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.claimAdmin();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isAdminClaimed"] });
    },
  });
}

// ─── registerUser ─────────────────────────────────────────────────────────
export function useRegisterUser() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (params: {
      principalId: string;
      nama: string;
      email: string;
      whatsapp: string;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.registerUser(
        params.principalId,
        params.nama,
        params.email,
        params.whatsapp,
        Role.adminuser,
        null,
        null
      );
    },
  });
}

// ─── registerClient ───────────────────────────────────────────────────────
export function useRegisterClient() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (params: {
      principalId: string;
      nama: string;
      email: string;
      whatsapp: string;
      company: string;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.registerUser(
        params.principalId,
        params.nama,
        params.email,
        params.whatsapp,
        Role.client,
        params.company || "-",
        null
      );
    },
  });
}

// ─── registerPartner ──────────────────────────────────────────────────────
export function useRegisterPartner() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (params: {
      principalId: string;
      nama: string;
      email: string;
      whatsapp: string;
      kota: string;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.registerUser(
        params.principalId,
        params.nama,
        params.email,
        params.whatsapp,
        Role.partner,
        null,
        params.kota
      );
    },
  });
}

// ─── getUserByPrincipal ───────────────────────────────────────────────────
export function useGetUserByPrincipal() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (principalId: string) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.getUserByPrincipal(principalId);
    },
  });
}

// ─── getUserRole ──────────────────────────────────────────────────────────
export function useGetUserRole() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.getUserRole();
    },
  });
}
