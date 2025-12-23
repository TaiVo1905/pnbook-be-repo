export interface UserResponeDto {
  id: string;
  username: string;
  password?: string;
  email?: string;
}

export interface SignInResponseDto {
  status: string;
  code?: number;
  message: string;
  accessToken: string;
  user: UserResponeDto;
}
