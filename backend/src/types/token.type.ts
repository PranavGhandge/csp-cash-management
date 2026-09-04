export interface ITokenPayload {
    id: string;
    role: "SUPER_ADMIN" | "ADMIN" | "OPERATOR";
    admin_id: string | null;
}