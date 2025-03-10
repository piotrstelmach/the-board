import { getAuthToken } from './authToken';
import { axiosInstance } from '../config/api';

export const unprotectedRoute = <T>(
  path: string,
  method: string,
  params?: string | null,
  data?: object | null
) =>
  axiosInstance.request<T>({
    url: path,
    method: method,
    params,
    data,
  });

export const protectedRoute = <T>(
  path: string,
  method: string,
  params?: string,
  data?: object
) =>
  axiosInstance.request<T>({
    headers: {
      authorization: 'Bearer ' + getAuthToken(),
    },
    withCredentials: true,
    url: path,
    method,
    params,
    data,
  });
