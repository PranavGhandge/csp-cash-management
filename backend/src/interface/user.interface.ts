export interface ICreateUser {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: "SUPER_ADMIN" | "ADMIN" | "OPERATOR";
    admin_id?: string | null;
}

export interface ILoginUser {
    email: string;
    password: string;
}