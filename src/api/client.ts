import axios, {type AxiosInstance, type AxiosRequestConfig} from "axios";

const baseURL = "https://app.ticketmaster.com";

const apiKey = process.env.EXPO_PUBLIC_TICKETMASTER_API_KEY;

const client: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
});

client.interceptors.request.use((config) => {
  const params = new URLSearchParams(config.params as Record<string, string> | undefined);

  if (apiKey && !params.has("apikey")) {
    params.set("apikey", apiKey);
  }

  return {
    ...config,
    params,
  };
});

export async function get<T>(url: string, params?: Record<string, unknown>, config?: AxiosRequestConfig) {
  const response = await client.get<T>(url, {
    ...config,
    params: {
      ...(params ?? {}),
    },
  });

  return response.data;
}