export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponseDto {
  id: number;
  name: string | null;
  email: string;
}
