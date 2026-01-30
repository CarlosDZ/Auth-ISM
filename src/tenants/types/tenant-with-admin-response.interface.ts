export interface TenantResponse {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
}
export interface AdminResponse {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
}
export interface TenantWithAdminResponse {
    tenant: TenantResponse;
    admin: AdminResponse;
}
