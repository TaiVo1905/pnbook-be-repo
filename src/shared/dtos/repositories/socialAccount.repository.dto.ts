export interface CreateSocialAccountParams {
  userId: string;
  provider: 'google';
  providerId: string;
}

export interface FindBySocialIdParams {
  provider: 'google';
  providerId: string;
}
