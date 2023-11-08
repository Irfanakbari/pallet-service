export interface UserInfo {
    exp: number;
    iat: number;
    auth_time: number;
    jti: string;
    iss: string;
    aud: string;
    sub: string;
    typ: string;
    azp: string;
    session_state: string;
    acr: string;
    allowed_origins: string[];
    realm_access: {
        roles: string[];
    };
    resource_access: {
        'pallet-control': {
            roles: string[];
        };
        account: {
            roles: string[];
        };
    };
    scope: string;
    sid: string;
    email_verified: boolean;
    name: string;
    preferred_username: string;
    given_name: string;
    family_name: string;
    email: string;
    pallet_department?: string[];
}
