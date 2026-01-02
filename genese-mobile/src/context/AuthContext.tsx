import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { clearTokens, loadTokens, saveTokens } from "../storage/secure";
import { makeHttp } from "../api/http";
import { makeGeneseApi } from "../api/genese";

type Role = "USER" | "STAFF";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  role: Role;
  setRole: (r: Role) => void;
  ready: boolean;

  // flow ids
  bilanId: string | null;
  programmeId: string | null;
  seanceId: string | null;

  setFlow: (p: Partial<Pick<AuthState, "bilanId" | "programmeId" | "seanceId">>) => void;

  api: ReturnType<typeof makeGeneseApi> | null;

  setTokens: (t: { accessToken: string; refreshToken: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [role, setRoleState] = useState<Role>("USER");
  const setRole = (r: Role) => setRoleState(r);
  const [ready, setReady] = useState(false);

  const [bilanId, setBilanId] = useState<string | null>(null);
  const [programmeId, setProgrammeId] = useState<string | null>(null);
  const [seanceId, setSeanceId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const t = await loadTokens();
      setAccessToken(t.accessToken);
      setRefreshToken(t.refreshToken);
      setReady(true);
    })();
  }, []);

  async function setTokens(t: { accessToken: string; refreshToken: string }) {
    setAccessToken(t.accessToken);
    setRefreshToken(t.refreshToken);
    await saveTokens(t.accessToken, t.refreshToken);
  }

  async function logout() {
    await clearTokens();
    setAccessToken(null);
    setRefreshToken(null);
    setRoleState("USER");
    setBilanId(null);
    setProgrammeId(null);
    setSeanceId(null);
  }

  const http = useMemo(() => {
    return makeHttp({
      getAccessToken: () => accessToken,
      getRefreshToken: () => refreshToken,
      setTokens,
      clearSession: logout,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, refreshToken]);

  const api = useMemo(() => makeGeneseApi(http.request), [http]);

  const value: AuthState = {
    accessToken,
    refreshToken,
    role,
    setRole,
    ready,
    bilanId,
    programmeId,
    seanceId,
    setFlow: (p) => {
      if (p.bilanId !== undefined) setBilanId(p.bilanId);
      if (p.programmeId !== undefined) setProgrammeId(p.programmeId);
      if (p.seanceId !== undefined) setSeanceId(p.seanceId);
    },
    api,
    setTokens: async (t) => {
      await setTokens(t);
      // best-effort role inference: if you login as staff/admin, backend may return administrateur
      // We'll infer on login screen based on response.
    },
    logout,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
