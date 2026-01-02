import React from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Card, PrimaryButton, Screen, Subtitle, Title } from "../utils/ui";
import type { RootStackParamList } from "../navigation/AppNavigator";

export default function WelcomeScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <Screen>
      <Title>GENESE</Title>
      <Subtitle>Votre parcours de mobilité et de sécurité, guidé séance par séance.</Subtitle>

      <Card>
        <Subtitle>
          Cette app se connecte à votre backend GENESE (REST). Pour tester sur téléphone, remplacez
          “localhost” par l’IP de votre PC dans app.json (extra.apiBaseUrl).
        </Subtitle>
        <PrimaryButton title="Commencer" onPress={() => nav.navigate("RoleSelector")} />
      </Card>
    </Screen>
  );
}
