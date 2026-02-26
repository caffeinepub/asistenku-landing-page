import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface RegisterUserResponse {
    ok: boolean;
    message: string;
    idUser: string;
}
export interface TaskRecord {
    id: string;
    status: TaskStatus;
    clientId: Principal;
    tipeLayanan: string;
    gdrive_client?: string;
    createdAt: bigint;
    deadline: bigint;
    detailTask: string;
    partnerId?: Principal;
    gdrive_internal?: string;
    judulTask: string;
}
export interface UnitTopUp {
    clientId: Principal;
    approvedBy: Principal;
    totalCost: bigint;
    pricePerUnit: bigint;
    unitsAdded: bigint;
    timestamp: bigint;
    layananId: bigint;
    topUpId: bigint;
}
export interface Layanan {
    id: bigint;
    status: LayananStatus;
    clientId: Principal;
    name: string;
    unitBalance: bigint;
    hargaPerUnit: bigint;
}
export interface Delegation {
    status: string;
    assignedBy: Principal;
    createdAt: bigint;
    deadline: bigint;
    unitLayananTerpakai: bigint;
    partnerId: Principal;
    updatedAt: bigint;
    taskId: string;
    delegationId: bigint;
    jamEfektifPengerjaan: bigint;
}
export interface UserProfile {
    status: string;
    nama: string;
    role: string;
    whatsapp: string;
    email: string;
    idUser: string;
}
export enum LayananStatus {
    aktif = "aktif",
    tidakAktif = "tidakAktif"
}
export enum Role {
    client = "client",
    admin = "admin",
    adminfinance = "adminfinance",
    concierge = "concierge",
    adminuser = "adminuser",
    guest = "guest",
    asistenmu = "asistenmu",
    partner = "partner"
}
export enum TaskStatus {
    cancelled = "cancelled",
    open = "open",
    selesai = "selesai",
    inProgress = "inProgress",
    memintaReview = "memintaReview"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    activateLayanan(layananId: bigint): Promise<Layanan>;
    approveUser(principalId: string, _approved: boolean): Promise<{
        ok: boolean;
        message: string;
    }>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignTaskToPartner(taskId: string, partnerId: Principal, delegationId: bigint, assignedBy: Principal): Promise<TaskRecord>;
    claimAdmin(): Promise<{
        ok: boolean;
        message: string;
    }>;
    completeTask(taskId: string): Promise<TaskRecord>;
    createDelegation(taskId: string, partnerId: Principal, deadline: bigint, jamEfektifPengerjaan: bigint, unitLayananTerpakai: bigint): Promise<Delegation>;
    createLayanan(name: string, clientId: Principal, hargaPerUnit: bigint): Promise<Layanan>;
    createTask(tipeLayanan: string, judulTask: string, detailTask: string, deadline: bigint, gdrive_internal: string | null, gdrive_client: string | null): Promise<TaskRecord>;
    getActiveAsistenmu(): Promise<Array<UserProfile>>;
    getActiveClients(): Promise<Array<UserProfile>>;
    getActiveInternalStaff(): Promise<Array<UserProfile>>;
    getActiveLayanan(page: bigint): Promise<Array<Layanan>>;
    getActivePartners(): Promise<Array<UserProfile>>;
    getAllDelegations(): Promise<Array<Delegation>>;
    getAllLayanan(): Promise<Array<Layanan>>;
    getAllTasks(): Promise<Array<TaskRecord>>;
    getAllTopUps(): Promise<Array<UnitTopUp>>;
    getAllUsers(): Promise<Array<UserProfile>>;
    getAsistenmuCount(): Promise<bigint>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClientCount(): Promise<bigint>;
    getClientTopUps(clientId: Principal): Promise<Array<UnitTopUp>>;
    getInternalStaffCount(): Promise<bigint>;
    getMyDelegationsAsPartner(): Promise<Array<Delegation>>;
    getMyLayanan(): Promise<Array<Layanan>>;
    getMyTasksAsClient(): Promise<Array<TaskRecord>>;
    getMyTasksAsPartner(): Promise<Array<TaskRecord>>;
    getPaginatedLayanan(page: bigint): Promise<Array<Layanan>>;
    getPartnerActiveEffectiveHours(partnerId: Principal): Promise<bigint>;
    getPartnerCount(): Promise<bigint>;
    getUserByPrincipal(principalId: string): Promise<{
        status: string;
        nama: string;
        role: string;
        idUser: string;
    } | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserRole(): Promise<Role | null>;
    isAdminClaimed(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    partnerRequestsReview(taskId: string): Promise<TaskRecord>;
    redelegateTask(delegationId: bigint, newPartnerId: Principal): Promise<TaskRecord>;
    registerUser(principalId: string, nama: string, email: string, whatsapp: string, role: Role, company: string | null, kota: string | null, sharePercentage: bigint): Promise<RegisterUserResponse>;
    saveCallerUserProfile(profile: UserProfile): Promise<{
        ok: boolean;
        message: string;
    }>;
    searchPartners(queryText: string): Promise<Array<UserProfile>>;
    topUpUnits(clientId: Principal, layananId: bigint, units: bigint, paymentAmount: bigint): Promise<{
        ok: boolean;
        message: string;
    }>;
}
