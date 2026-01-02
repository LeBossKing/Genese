import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Field } from "../utils/Form";
import { Card, DangerText, PrimaryButton, Screen, Subtitle, Title } from "../utils/ui";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../context/AuthContext";

export default function SignUpScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { api, setTokens, setRole } = useAuth();

  const [prenom, setPrenom] = useState("Mustapha");
  const [email, setEmail] = useState("user1@test.com");
  const [motDePasse, setMotDePasse] = useState("Password123!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSignup() {
    if (!api) return;
    setLoading(true);
    setError(null);

    const res = await api.signup({ prenom, email, mot_de_passe: motDePasse });

    setLoading(false);

    if (!res.success) {
      setError(res.error.message);
      return;
    }

    await setTokens(res.data.tokens);
    setRole("USER");

    nav.reset({ index: 0, routes: [{ name: "ProfileSetup" }] });
  }

  return (
    <Screen>
      <Title>Créer un compte</Title>
      <Subtitle>POST /auth/signup</Subtitle>

      <Card>
        <Field label="Prénom" value={prenom} onChangeText={setPrenom} />
        <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Field label="Mot de passe" value={motDePasse} onChangeText={setMotDePasse} secureTextEntry />
        {error ? <DangerText>{error}</DangerText> : null}
        <PrimaryButton title="Créer" onPress={onSignup} loading={loading} />
      </Card>
    </Screen>
  );
}
