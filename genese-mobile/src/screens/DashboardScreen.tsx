import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../context/AuthContext";
import { Card, PrimaryButton, Screen, Subtitle, Title, colors } from "../utils/ui";

export default function DashboardScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { api, programmeId, seanceId, logout } = useAuth();

  const [data, setData] = useState<any | null>(null);
  const [notifs, setNotifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (!api) return;
      setLoading(true);
      const [dash, notif] = await Promise.all([api.dashboard(), api.notifications()]);
      setLoading(false);

      if (dash.success) setData(dash.data);
      if (notif.success) setNotifs(notif.data);
    })();
  }, [api]);

  return (
    <Screen>
      <Title>Tableau de bord</Title>
      <Subtitle>{loading ? "Chargement..." : "GET /dashboard"}</Subtitle>

      <Card>
        <Subtitle>Programme courant: {programmeId ?? data?.programme?.id ?? "—"}</Subtitle>
        <PrimaryButton title="Voir mon programme" onPress={() => nav.navigate("Program")} disabled={!programmeId && !data?.programme} />
        <PrimaryButton title="Lancer séance" onPress={() => nav.navigate("Session", { seanceId: seanceId ?? undefined })} disabled={!seanceId} />
        <PrimaryButton title="Mettre à jour mon profil" onPress={() => nav.navigate("ProfileSetup")} />
      </Card>

      <Card>
        <Subtitle>Notifications</Subtitle>
        {notifs?.length ? (
          <FlatList
            data={notifs.slice(0, 10)}
            keyExtractor={(i, idx) => i._id ?? i.id ?? String(idx)}
            renderItem={({ item }) => (
              <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#23233A" }}>
                <Text style={{ color: colors.text, fontWeight: item.lu ? "400" : "700" }}>
                  {item.message ?? "Notification"}
                </Text>
                <Text style={{ color: colors.muted, marginTop: 4 }}>{item.date_envoi ? new Date(item.date_envoi).toLocaleString() : ""}</Text>
              </View>
            )}
          />
        ) : (
          <Subtitle>Aucune notification.</Subtitle>
        )}
      </Card>

      <Card>
        <PrimaryButton title="Se déconnecter" onPress={() => logout()} />
      </Card>
    </Screen>
  );
}
