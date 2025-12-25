export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponseDto {
  id: string;
  name: string | null;
  email: string;
}
