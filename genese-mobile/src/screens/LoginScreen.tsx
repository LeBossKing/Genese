import React, { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Field } from "../utils/Form";
import { Card, DangerText, PrimaryButton, Screen, Subtitle, Title } from "../utils/ui";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "Login">>();
  const { api, setTokens, setRole } = useAuth();

  const [email, setEmail] = useState("admin@genese.local");
  const [motDePasse, setMotDePasse] = useState("AdminPassword123!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roleHint = route.params?.role ?? "USER";

  async function onLogin() {
    if (!api) return;
    setLoading(true);
    setError(null);

    const res = await api.login({ email, mot_de_passe: motDePasse });

    setLoading(false);

    if (!res.success) {
      setError(res.error.message);
      return;
    }

    await setTokens({ accessToken: res.data.accessToken, refreshToken: res.data.refreshToken });

    // Infer role: staff logins return administrateur in data (per backend)
    if (res.data.administrateur) setRole("STAFF");
    else setRole("USER");

    // After login, go to dashboard
    nav.reset({ index: 0, routes: [{ name: "Dashboard" }] });
  }

  return (
    <Screen>
      <Title>Connexion</Title>
      <Subtitle>{roleHint === "STAFF" ? "Staff" : "Utilisateur"} — POST /auth/login</Subtitle>

      <Card>
        <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Field label="Mot de passe" value={motDePasse} onChangeText={setMotDePasse} secureTextEntry />
        {error ? <DangerText>{error}</DangerText> : null}
        <PrimaryButton title="Se connecter" onPress={onLogin} loading={loading} />
      </Card>

      <Card>
        <Subtitle>Pas encore de compte utilisateur ?</Subtitle>
        <PrimaryButton title="Créer un compte" onPress={() => nav.navigate("SignUp")} />
      </Card>
    </Screen>
  );
}
