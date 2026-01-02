import React from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Card, PrimaryButton, Screen, Subtitle, Title } from "../utils/ui";
import type { RootStackParamList } from "../navigation/AppNavigator";

export default function RoleSelectorScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Screen>
      <Title>Choisir un rôle</Title>
      <Subtitle>Utilisateur sédentaire ou staff (admin/coach/kiné) via le même endpoint login.</Subtitle>

      <Card>
        <PrimaryButton title="Je suis un utilisateur" onPress={() => nav.navigate("Login", { role: "USER" })} />
        <PrimaryButton title="Je suis staff" onPress={() => nav.navigate("Login", { role: "STAFF" })} />
      </Card>

      <Card>
        <Subtitle>Pas de compte ?</Subtitle>
        <PrimaryButton title="Créer un compte" onPress={() => nav.navigate("SignUp")} />
      </Card>
    </Screen>
  );
}
