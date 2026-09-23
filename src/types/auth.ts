
export type UserRole = "CUSTOMER" | "ADMIN";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  // Email nuevo pedido en /account (ver ChangeEmailForm) — null si no hay
  // ningún cambio esperando que se confirme desde el mail.
  pendingEmail: string | null;
  phone: string | null;
  role: UserRole;
  emailVerified: boolean;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface TwoFactorChallenge {
  requires2fa: true;
  challengeToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}
