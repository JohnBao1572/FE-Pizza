export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    isVerify: boolean;
    isDeleted: boolean;
    verifyCode: string;
    verificationCodeExpiry: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export interface LoginResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}