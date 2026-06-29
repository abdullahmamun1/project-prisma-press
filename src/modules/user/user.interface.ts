export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  profilePhoto?: string;
}

export type TMeta = {
  page: number;
  limit: number;
  total: number;
};

export type TResponseData<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: TMeta;
};
