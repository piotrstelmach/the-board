import { getAuthToken } from './authToken';
import { axiosInstance } from '../config/api';

export const unprotectedRoute = (
  path: string,
  method: string,
  params?: string | null,
  data?: object | null
) =>
  axiosInstance.request({
    url: path,
    method: method,
    params,
    data,
  });

export const protectedRoute = (
  path: string,
  method: string,
  params?: string,
  data?: object
) =>
  axiosInstance.request({
    headers: {
      authorization: 'Bearer ' + getAuthToken(),
    },
    withCredentials: true,
    url: path,
    method,
    params,
    data,
  });
