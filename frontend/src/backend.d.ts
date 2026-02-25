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
export interface UserProfile {
    status: string;
    nama: string;
    role: string;
    whatsapp: string;
    email: string;
    idUser: string;
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
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
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
}
