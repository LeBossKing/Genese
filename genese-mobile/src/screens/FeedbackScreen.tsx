import React, { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Field } from "../utils/Form";
import { Card, DangerText, PrimaryButton, Screen, Subtitle, Title, colors } from "../utils/ui";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { Pressable, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";

const chip = (active: boolean) => ({
  paddingVertical: 8,
  paddingHorizontal: 10,
  borderRadius: 999,
  borderWidth: 1,
  borderColor: active ? colors.primary : "#2B2B44",
  backgroundColor: active ? "#221F55" : "#0F0F17",
  marginRight: 8,
  marginTop: 8,
});

export default function FeedbackScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "Feedback">>();
  const { api } = useAuth();

  const seanceId = route.params.seanceId;

  const [rpe, setRpe] = useState("6");
  const [douleur, setDouleur] = useState("2");
  const [ressenti, setRessenti] = useState<"TRES_FACILE" | "FACILE" | "BON" | "DIFFICILE" | "TRES_DIFFICILE">("BON");
  const [commentaire, setCommentaire] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSend() {
    if (!api) return;
    setLoading(true);
    setError(null);

    const res = await api.addFeedback(seanceId, {
      rpe: Number(rpe),
      douleur_nrs_post: Number(douleur),
      ressenti_general: ressenti,
      commentaire_libre: commentaire || undefined,
      date_execution: new Date().toISOString(),
    });

    setLoading(false);

    if (!res.success) {
      setError(res.error.message);
      return;
    }

    // Back to dashboard (or program)
    nav.reset({ index: 0, routes: [{ name: "Dashboard" }] });
  }

  return (
    <Screen>
      <Title>Feedback séance</Title>
      <Subtitle>POST /seances/:id/feedback — peut déclencher alerte (douleur ≥ 6) et bloquer programme</Subtitle>

      <Card>
        <Subtitle>Séance: {seanceId}</Subtitle>
        <Field label="RPE (0-10)" value={rpe} onChangeText={setRpe} keyboardType="numeric" />
        <Field label="Douleur après (0-10)" value={douleur} onChangeText={setDouleur} keyboardType="numeric" />

        <Subtitle>Ressenti général</Subtitle>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {(["TRES_FACILE", "FACILE", "BON", "DIFFICILE", "TRES_DIFFICILE"] as const).map((r) => (
            <Pressable key={r} onPress={() => setRessenti(r)} style={chip(ressenti === r)}>
              <Text style={{ color: colors.text }}>{r}</Text>
            </Pressable>
          ))}
        </View>

        <Field label="Commentaire" value={commentaire} onChangeText={setCommentaire} placeholder="Optionnel" />

        {error ? <DangerText>{error}</DangerText> : null}
        <PrimaryButton title="Envoyer" onPress={onSend} loading={loading} />
      </Card>
    </Screen>
  );
}
