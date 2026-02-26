import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import { UserProfile, TaskRecord, Layanan, Delegation, UnitTopUp, Role } from "../backend";
import { Principal } from "@dfinity/principal";

// ─── Admin Bootstrap ────────────────────────────────────────────────────────

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

export const useGetIsAdminClaimed = useIsAdminClaimed;

export function useClaimAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.claimAdmin();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isAdminClaimed"] });
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    },
  });
}

// ─── User Management ────────────────────────────────────────────────────────

export function useRegisterUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      principalId: string;
      nama: string;
      email: string;
      whatsapp: string;
      role: Role;
      company?: string;
      kota?: string;
      sharePercentage?: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.registerUser(
        params.principalId,
        params.nama,
        params.email,
        params.whatsapp,
        params.role,
        params.company ?? null,
        params.kota ?? null,
        params.sharePercentage ?? BigInt(0)
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      queryClient.invalidateQueries({ queryKey: ["activeClients"] });
      queryClient.invalidateQueries({ queryKey: ["activePartners"] });
      queryClient.invalidateQueries({ queryKey: ["activeAsistenmu"] });
      queryClient.invalidateQueries({ queryKey: ["activeInternalStaff"] });
    },
  });
}

// Dedicated client registration mutation (role hardcoded to client)
export function useRegisterClient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      principalId: string;
      nama: string;
      email: string;
      whatsapp: string;
      company?: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.registerUser(
        params.principalId,
        params.nama,
        params.email,
        params.whatsapp,
        Role.client,
        params.company ?? null,
        null,
        BigInt(0)
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      queryClient.invalidateQueries({ queryKey: ["activeClients"] });
    },
  });
}

// Dedicated partner registration mutation (role hardcoded to partner)
export function useRegisterPartner() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      principalId: string;
      nama: string;
      email: string;
      whatsapp: string;
      kota?: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.registerUser(
        params.principalId,
        params.nama,
        params.email,
        params.whatsapp,
        Role.partner,
        null,
        params.kota ?? null,
        BigInt(0)
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      queryClient.invalidateQueries({ queryKey: ["activePartners"] });
    },
  });
}

// getUserByPrincipal as mutation (for imperative calls in portals)
export function useGetUserByPrincipalMutation() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (principalId: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.getUserByPrincipal(principalId);
    },
  });
}

// getUserByPrincipal as query (for reactive data fetching)
export function useGetUserByPrincipal(principalId: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userByPrincipal", principalId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserByPrincipal(principalId);
    },
    enabled: !!actor && !isFetching && !!principalId,
  });
}

// getUserRole as query (reactive)
export function useGetUserRoleQuery() {
  const { actor, isFetching } = useActor();
  return useQuery<Role | null>({
    queryKey: ["userRole"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserRole();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

// getUserRole as mutation (for imperative role checks in portals)
export function useGetUserRole() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getUserRole();
    },
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useGetAllUsers() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile[]>({
    queryKey: ["allUsers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { principalId: string; approved: boolean }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.approveUser(params.principalId, params.approved);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    },
  });
}

// ─── Active Users by Role ────────────────────────────────────────────────────

export function useActiveClients() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile[]>({
    queryKey: ["activeClients"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveClients();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useActivePartners() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile[]>({
    queryKey: ["activePartners"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActivePartners();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useActiveAsistenmu() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile[]>({
    queryKey: ["activeAsistenmu"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveAsistenmu();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useActiveInternalStaff() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile[]>({
    queryKey: ["activeInternalStaff"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveInternalStaff();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Layanan ────────────────────────────────────────────────────────────────

export function useGetMyLayanan() {
  const { actor, isFetching } = useActor();
  return useQuery<Layanan[]>({
    queryKey: ["myLayanan"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyLayanan();
    },
    enabled: !!actor && !isFetching,
  });
}

export const useMyLayanan = useGetMyLayanan;

export function useGetAllLayanan() {
  const { actor, isFetching } = useActor();
  return useQuery<Layanan[]>({
    queryKey: ["allLayanan"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllLayanan();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePaginatedLayanan(page: number) {
  const { actor, isFetching } = useActor();
  return useQuery<Layanan[]>({
    queryKey: ["paginatedLayanan", page],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPaginatedLayanan(BigInt(page));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateLayanan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      name: string;
      clientId: Principal;
      hargaPerUnit: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createLayanan(params.name, params.clientId, params.hargaPerUnit);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allLayanan"] });
      queryClient.invalidateQueries({ queryKey: ["paginatedLayanan"] });
      queryClient.invalidateQueries({ queryKey: ["myLayanan"] });
    },
  });
}

export function useActivateLayanan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (layananId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.activateLayanan(layananId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allLayanan"] });
      queryClient.invalidateQueries({ queryKey: ["paginatedLayanan"] });
    },
  });
}

export function useTopUpUnits() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      clientId: Principal;
      layananId: bigint;
      units: bigint;
      paymentAmount: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.topUpUnits(
        params.clientId,
        params.layananId,
        params.units,
        params.paymentAmount
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allLayanan"] });
      queryClient.invalidateQueries({ queryKey: ["paginatedLayanan"] });
      queryClient.invalidateQueries({ queryKey: ["myLayanan"] });
      queryClient.invalidateQueries({ queryKey: ["allTopUps"] });
    },
  });
}

// ─── Tasks ──────────────────────────────────────────────────────────────────

export function useGetMyTasksAsClient() {
  const { actor, isFetching } = useActor();
  return useQuery<TaskRecord[]>({
    queryKey: ["myTasksAsClient"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyTasksAsClient();
    },
    enabled: !!actor && !isFetching,
  });
}

export const useMyTasksAsClient = useGetMyTasksAsClient;

export function useGetMyTasksAsPartner() {
  const { actor, isFetching } = useActor();
  return useQuery<TaskRecord[]>({
    queryKey: ["myTasksAsPartner"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyTasksAsPartner();
    },
    enabled: !!actor && !isFetching,
  });
}

export const useMyTasksAsPartner = useGetMyTasksAsPartner;

export function useAllTasks() {
  const { actor, isFetching } = useActor();
  return useQuery<TaskRecord[]>({
    queryKey: ["allTasks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTasks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      tipeLayanan: string;
      judulTask: string;
      detailTask: string;
      deadline: bigint;
      gdrive_internal?: string;
      gdrive_client?: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createTask(
        params.tipeLayanan,
        params.judulTask,
        params.detailTask,
        params.deadline,
        params.gdrive_internal ?? null,
        params.gdrive_client ?? null
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myTasksAsClient"] });
      queryClient.invalidateQueries({ queryKey: ["allTasks"] });
    },
  });
}

export function useCompleteTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (taskId: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.completeTask(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myTasksAsClient"] });
      queryClient.invalidateQueries({ queryKey: ["allTasks"] });
    },
  });
}

export function usePartnerRequestsReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (taskId: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.partnerRequestsReview(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myTasksAsPartner"] });
      queryClient.invalidateQueries({ queryKey: ["allTasks"] });
    },
  });
}

export const useRequestReview = usePartnerRequestsReview;

export function useAssignTaskToPartner() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      taskId: string;
      partnerId: Principal;
      delegationId: bigint;
      assignedBy: Principal;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.assignTaskToPartner(
        params.taskId,
        params.partnerId,
        params.delegationId,
        params.assignedBy
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allTasks"] });
      queryClient.invalidateQueries({ queryKey: ["allDelegations"] });
    },
  });
}

// ─── Delegations ─────────────────────────────────────────────────────────────

export function useAllDelegations() {
  const { actor, isFetching } = useActor();
  return useQuery<Delegation[]>({
    queryKey: ["allDelegations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDelegations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyDelegationsAsPartner() {
  const { actor, isFetching } = useActor();
  return useQuery<Delegation[]>({
    queryKey: ["myDelegationsAsPartner"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyDelegationsAsPartner();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateDelegation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      taskId: string;
      partnerId: Principal;
      deadline: bigint;
      jamEfektifPengerjaan: bigint;
      unitLayananTerpakai: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createDelegation(
        params.taskId,
        params.partnerId,
        params.deadline,
        params.jamEfektifPengerjaan,
        params.unitLayananTerpakai
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allTasks"] });
      queryClient.invalidateQueries({ queryKey: ["allDelegations"] });
      queryClient.invalidateQueries({ queryKey: ["myTasksAsPartner"] });
    },
  });
}

export function useRedelegateTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      delegationId: bigint;
      newPartnerId: Principal;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.redelegateTask(params.delegationId, params.newPartnerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allTasks"] });
      queryClient.invalidateQueries({ queryKey: ["allDelegations"] });
      queryClient.invalidateQueries({ queryKey: ["myTasksAsPartner"] });
    },
  });
}

// ─── Partner Search & Hours ──────────────────────────────────────────────────

export function useSearchPartners(queryText: string) {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile[]>({
    queryKey: ["searchPartners", queryText],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchPartners(queryText);
    },
    enabled: !!actor && !isFetching && queryText.length >= 2,
  });
}

export function usePartnerActiveHours(partnerId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["partnerActiveHours", partnerId],
    queryFn: async () => {
      if (!actor || !partnerId) return BigInt(0);
      const principal = Principal.fromText(partnerId);
      return actor.getPartnerActiveEffectiveHours(principal);
    },
    enabled: !!actor && !isFetching && !!partnerId,
  });
}

// ─── Financial Profile (stub — not in current backend) ───────────────────────

export function useGetMyFinancialProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["myFinancialProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return null;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMyFinancialProfileUpdateRequests() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["myFinancialProfileUpdateRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRequestFinancialProfileUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_params: unknown) => {
      return { ok: false, message: "Not implemented" };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myFinancialProfileUpdateRequests"] });
    },
  });
}

// ─── Top-Up History ──────────────────────────────────────────────────────────

export function useGetAllTopUps() {
  const { actor, isFetching } = useActor();
  return useQuery<UnitTopUp[]>({
    queryKey: ["allTopUps"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTopUps();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetClientTopUps(clientId: Principal | null) {
  const { actor, isFetching } = useActor();
  return useQuery<UnitTopUp[]>({
    queryKey: ["clientTopUps", clientId?.toString()],
    queryFn: async () => {
      if (!actor || !clientId) return [];
      return actor.getClientTopUps(clientId);
    },
    enabled: !!actor && !isFetching && !!clientId,
  });
}
