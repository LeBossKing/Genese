import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Card, PrimaryButton, Screen, Subtitle, Title, colors } from "../utils/ui";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../context/AuthContext";

export default function SessionScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "Session">>();
  const { api, seanceId: ctxSeanceId, setFlow } = useAuth();

  const seanceId = route.params?.seanceId ?? ctxSeanceId ?? null;

  const [seance, setSeance] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (!api || !seanceId) return;
      setLoading(true);
      const res = await api.getSeance(seanceId);
      setLoading(false);
      if (res.success) {
        setSeance(res.data);
        setFlow({ seanceId });
      }
    })();
  }, [api, seanceId]);

  const exercises = useMemo(() => {
    return seance?.exercices ?? seance?.SeanceExercice ?? seance?.items ?? [];
  }, [seance]);

  return (
    <Screen>
      <Title>Séance</Title>
      <Subtitle>GET /seances/:id</Subtitle>

      <Card>
        <Subtitle>ID: {seanceId ?? "(aucun)"}</Subtitle>
        <Subtitle>{loading ? "Chargement..." : seance?.focus ?? seance?.focus_programme ?? ""}</Subtitle>
        <Subtitle>Durée: {seance?.duree_minutes ?? "?"} min</Subtitle>
      </Card>

      <Card>
        <Subtitle>Exercices</Subtitle>
        {exercises?.length ? (
          <FlatList
            data={exercises}
            keyExtractor={(item, idx) => item._id ?? item.id ?? String(idx)}
            renderItem={({ item, index }) => (
              <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#23233A" }}>
                <Text style={{ color: colors.text, fontWeight: "600" }}>
                  {index + 1}. {item.titre ?? item.exercice?.titre ?? "Exercice"}
                </Text>
                <Text style={{ color: colors.muted, marginTop: 4 }}>
                  {item.duree_sec ?? item.duree_recommandee_sec ?? item.exercice?.duree_recommandee_sec ?? "?"} sec
                </Text>
              </View>
            )}
          />
        ) : (
          <Subtitle>Aucun exercice dans la réponse.</Subtitle>
        )}
      </Card>

      <PrimaryButton title="Terminer la séance" onPress={() => { if (seanceId) nav.navigate("Feedback", { seanceId }); }} />
    </Screen>
  );
}
