import Constants from "expo-constants";

type Extra = {
  apiBaseUrl?: string;
};

export function getApiBaseUrl() {
  const extra = (Constants.expoConfig?.extra ?? {}) as Extra;
  return extra.apiBaseUrl ?? "http://localhost:3000/api";
}
