import React from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Card, PrimaryButton, Screen, Subtitle, Title } from "../utils/ui";
import type { RootStackParamList } from "../navigation/AppNavigator";

export default function TutorialScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Screen>
      <Title>Tutoriel</Title>
      <Subtitle>3 phases • règles de sécurité • comment donner du feedback</Subtitle>

      <Card>
        <Subtitle>1) Faites les mouvements lentement, sans forcer.</Subtitle>
        <Subtitle>2) Notez votre douleur (0-10). Douleur élevée → alerte sécurité.</Subtitle>
        <Subtitle>3) Donnez votre RPE après chaque séance pour adapter le programme.</Subtitle>

        <PrimaryButton title="Lancer l'auto-bilan" onPress={() => nav.navigate("Assessment")} />
      </Card>
    </Screen>
  );
}
