export interface BaseResponse<T> {
  result: T;
  success: boolean;
  message?: string;
}
