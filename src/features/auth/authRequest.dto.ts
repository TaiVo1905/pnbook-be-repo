export interface AuthRequestDto {
  name?: string;
  email: string;
  password: string;
  passwordConfirmation?: string;
}
