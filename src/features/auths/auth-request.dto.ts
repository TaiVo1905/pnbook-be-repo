export interface SignInRequestDto {
  email: string;
  password: string;
  rememberMe: boolean;
}
export interface RefreshTokenRequestDto {
  refreshToken: string;
}
