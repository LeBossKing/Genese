import * as SecureStore from "expo-secure-store";

const KEY_ACCESS = "genese.accessToken";
const KEY_REFRESH = "genese.refreshToken";

export async function saveTokens(accessToken: string, refreshToken: string) {
  await SecureStore.setItemAsync(KEY_ACCESS, accessToken);
  await SecureStore.setItemAsync(KEY_REFRESH, refreshToken);
}

export async function loadTokens() {
  const [accessToken, refreshToken] = await Promise.all([
    SecureStore.getItemAsync(KEY_ACCESS),
    SecureStore.getItemAsync(KEY_REFRESH),
  ]);
  return { accessToken: accessToken ?? null, refreshToken: refreshToken ?? null };
}

export async function clearTokens() {
  await Promise.all([
    SecureStore.deleteItemAsync(KEY_ACCESS),
    SecureStore.deleteItemAsync(KEY_REFRESH),
  ]);
}
