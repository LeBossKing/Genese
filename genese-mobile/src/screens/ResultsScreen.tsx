import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Card, DangerText, PrimaryButton, Screen, Subtitle, Title } from "../utils/ui";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../context/AuthContext";

export default function ResultsScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { api, bilanId, setFlow } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onGenerate() {
    if (!api || !bilanId) return;
    setLoading(true);
    setError(null);

    const res = await api.generateProgramme({ bilan_id: bilanId });

    setLoading(false);

    if (!res.success) {
      setError(res.error.message);
      return;
    }

    setFlow({ programmeId: res.data.programme._id, seanceId: res.data.premiere_seance_id });
    nav.reset({ index: 0, routes: [{ name: "Program" }] });
  }

  return (
    <Screen>
      <Title>Résultats</Title>
      <Subtitle>Votre bilan est enregistré. Génération du programme personnalisée.</Subtitle>

      <Card>
        <Subtitle>Bilan ID: {bilanId ?? "(aucun)"}</Subtitle>
        {error ? <DangerText>{error}</DangerText> : null}
        <PrimaryButton title="Générer mon programme" onPress={onGenerate} loading={loading} disabled={!bilanId} />
      </Card>
    </Screen>
  );
}
