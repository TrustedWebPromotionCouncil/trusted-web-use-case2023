import axios from 'axios';

export const makeAxios = (baseURL?: string) => {
  const instance = axios.create({ baseURL });

  instance.interceptors.request.use((request) => {
    console.log('Starting Request: ', request);
    return request;
  });

  instance.interceptors.response.use((response) => {
    console.log('Response: ', response);
    return response;
  }, (error) => {
    console.log('Error: ', error);
    return Promise.reject(error);
  });

  return instance;
};
