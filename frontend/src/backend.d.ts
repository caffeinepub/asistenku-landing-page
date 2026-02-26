import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Layanan {
    id: bigint;
    status: LayananStatus;
    clientId: Principal;
    name: string;
}
export interface Task {
    id: string;
    tipeLayanan: string;
    createdAt: bigint;
    deadline: bigint;
    detailTask: string;
    judulTask: string;
}
export interface UserProfile {
    status: string;
    nama: string;
    role: string;
    whatsapp: string;
    email: string;
    idUser: string;
}
export interface RegisterUserResponse {
    ok: boolean;
    message: string;
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
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    claimAdmin(): Promise<{
        ok: boolean;
        message: string;
    }>;
    createLayanan(name: string, clientId: Principal): Promise<Layanan>;
    createTask(tipeLayanan: string, judulTask: string, detailTask: string, deadline: bigint): Promise<Task>;
    getAllLayanan(): Promise<Array<Layanan>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyLayanan(): Promise<Array<Layanan>>;
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
    registerUser(principalId: string, nama: string, email: string, whatsapp: string, role: Role, company: string | null, kota: string | null): Promise<RegisterUserResponse>;
    saveCallerUserProfile(profile: UserProfile): Promise<{
        ok: boolean;
        message: string;
    }>;
    updateLayananStatus(id: bigint, newStatus: LayananStatus): Promise<Layanan>;
}
