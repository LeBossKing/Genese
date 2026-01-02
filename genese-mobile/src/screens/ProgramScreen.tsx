import React, { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Card, PrimaryButton, Screen, Subtitle, Title, colors } from "../utils/ui";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../context/AuthContext";

export default function ProgramScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { api, programmeId, seanceId, setFlow } = useAuth();
  const [programme, setProgramme] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (!api || !programmeId) return;
      setLoading(true);
      const res = await api.getProgramme(programmeId);
      setLoading(false);
      if (res.success) setProgramme(res.data);
    })();
  }, [api, programmeId]);

  const seances: any[] = programme?.seances ?? programme?.Seances ?? programme?.items ?? [];

  return (
    <Screen>
      <Title>Programme</Title>
      <Subtitle>GET /programmes/:id</Subtitle>

      <Card>
        <Subtitle>Programme ID: {programmeId ?? "(aucun)"}</Subtitle>
        <Subtitle>Status: {programme?.statut ?? programme?.status ?? "?"}</Subtitle>

        <PrimaryButton
          title="Lancer la séance du jour"
          onPress={() => nav.navigate("Session", { seanceId: seanceId ?? undefined })}
          disabled={!seanceId}
        />
      </Card>

      <Card>
        <Subtitle>{loading ? "Chargement..." : "Séances"}</Subtitle>
        {seances?.length ? (
          <FlatList
            data={seances}
            keyExtractor={(item, idx) => item._id ?? item.id ?? String(idx)}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  const id = item._id ?? item.id;
                  if (id) {
                    setFlow({ seanceId: id });
                    nav.navigate("Session", { seanceId: id });
                  }
                }}
                style={{
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: "#23233A",
                }}
              >
                <Text style={{ color: colors.text, fontWeight: "600" }}>{item.titre ?? `Séance ${item.numero_seance ?? ""}`}</Text>
                <Text style={{ color: colors.muted, marginTop: 4 }}>
                  {item.phase ?? ""} • {item.duree_minutes ?? "?"} min
                </Text>
              </Pressable>
            )}
          />
        ) : (
          <View style={{ marginTop: 8 }}>
            <Subtitle>Aucune liste de séances incluse dans la réponse (selon ton backend).</Subtitle>
            <Subtitle>On peut aussi récupérer la séance via l’ID renvoyé lors du generate.</Subtitle>
          </View>
        )}
      </Card>
    </Screen>
  );
}
