import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Serializable } from '@/models';

export const API = axios.create({
  withCredentials: true,
});

let cancelTokenSource = axios.CancelToken.source();

API.interceptors.request.use(
  (config) => {
    // config.headers.Authorization = `Bearer ${localStorageService.authToken}`;
    config.params = config.params || {};
    config.baseURL = import.meta.env.VITE_API_ENDPOINT;

    // console.log(config);
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(undefined, (err) => {
  if (err.response) {
    return Promise.reject(err.response.data);
  } else {
    return Promise.reject(err);
  }
});

export class ApiService {
  async get<T extends Serializable<T>>(type: { new (): T }, path: string, params: any): Promise<T> {
    return API.get<T>(path, { params: params, cancelToken: cancelTokenSource.token }).then((value) => {
      return new type().deserialize(value.data);
    });
  }
  async getList<T extends Serializable<T>>(type: { new (): T }, path: string, params: any): Promise<T[]> {
    interface ListData {}
    return API.get<ListData>(path, { params: params, cancelToken: cancelTokenSource.token }).then((value: AxiosResponse) => {
      return value.data.map((d: any) => new type().deserialize(d));
    });
  }
  async post<T extends Serializable<T>>(type: { new (): T }, path: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return API.post<T>(path, data, config).then((value) => {
      return new type().deserialize(value.data);
    });
  }
}
