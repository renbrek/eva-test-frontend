export type LoadingStatus = 'idle' | 'pending' | 'succeeded' | 'failed';

export type FetchError = string | null | undefined;

export type ThunkInfo = {
  status: LoadingStatus;
  error: FetchError;
};

export interface JwtTokens {
  access_token: string;
  refresh_token: string;
}

export interface Restrictions {
  standardMaxButtonsCount: number;
  standardMaxButtonTextLength: number;
  standardLinksIsSupported: boolean;
  inlineMaxButtonsCount: number;
  inlineMaxButtonTextLength: number;
  inlineLinksIsSupported: boolean;
}
