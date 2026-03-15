export interface Status {
  connected: boolean;
  status: string;
}

export interface BackendResponse<T> {
  status: boolean;
  data: T;
}
