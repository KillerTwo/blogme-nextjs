export interface User {
    username: string;
    password: string;
}

export interface ApiResponse<T = any> {
    code: number;
    message: string;
    data: T;
}

export interface LoginResponse {
    access_token: string;
    refresh_token?: string;
    user?: {
        id: string;
        username: string;
        email?: string;
    };
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken?: string;
}

export interface RequestConfig extends RequestInit {
    skipAuth?: boolean;
    retryOnAuthError?: boolean;
}