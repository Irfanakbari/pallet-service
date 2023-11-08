// interface User {
//   id: string;
//   username: string;
//   email: string;
//   roles: UserRole[];
// }
//
// interface UserRole {
//   name: string;
//   role: string;
//   permissions: string[];
// }

interface FormattedRole {
    app: string;
    role: string;
    permissions: string[];
}

export interface User {
    id: number;
    username: string;
    email: string;
    isSuper: boolean;
    roles: FormattedRole[];
    iat?: number;
    exp?: number;
}
