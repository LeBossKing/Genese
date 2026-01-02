import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Field } from "../utils/Form";
import { Card, DangerText, PrimaryButton, Screen, Subtitle, Title, colors } from "../utils/ui";
import type { RootStackParamList } from "../navigation/AppNavigator";
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

export default function ProfileSetupScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { api } = useAuth();

  const [age, setAge] = useState("24");
  const [genre, setGenre] = useState<"HOMME" | "FEMME" | "AUTRE">("HOMME");
  const [metier, setMetier] = useState("Etudiant");
  const [objectif, setObjectif] = useState<"MOBILITE" | "DOULEUR" | "FORCE" | "ENDURANCE" | "POSTURE">("MOBILITE");
  const [temps, setTemps] = useState<"MOINS_10" | "DIX_20" | "VINGT_30" | "PLUS_30">("VINGT_30");
  const [lieu, setLieu] = useState<"MAISON" | "SALLE" | "EXTERIEUR">("MAISON");
  const [niveau, setNiveau] = useState<"INACTIF" | "SEDENTAIRE" | "ACTIF">("SEDENTAIRE");
  const [consent, setConsent] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSave() {
    if (!api) return;
    setLoading(true);
    setError(null);

    const res = await api.updateMe({
      age: Number(age),
      genre,
      metier,
      objectif_principal: objectif,
      temps_disponible: temps,
      lieu_pratique: lieu,
      niveau_activite: niveau,
    });

    if (!res.success) {
      setLoading(false);
      setError(res.error.message);
      return;
    }

    if (consent) {
      const c = await api.addConsent({ type_consentement: "RGPD", version_document: "1.0" });
      if (!c.success) {
        setLoading(false);
        setError(c.error.message);
        return;
      }
    }

    setLoading(false);
    nav.reset({ index: 0, routes: [{ name: "Tutorial" }] });
  }

  return (
    <Screen>
      <Title>Profil</Title>
      <Subtitle>PUT /users/me + POST /users/me/consents</Subtitle>

      <Card>
        <Field label="Âge" value={age} onChangeText={setAge} keyboardType="numeric" />
        <Field label="Métier" value={metier} onChangeText={setMetier} />

        <Subtitle>Genre</Subtitle>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {(["HOMME", "FEMME", "AUTRE"] as const).map((g) => (
            <Pressable key={g} onPress={() => setGenre(g)} style={chip(genre === g)}>
              <Text style={{ color: colors.text }}>{g}</Text>
            </Pressable>
          ))}
        </View>

        <Subtitle>Objectif</Subtitle>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {(["MOBILITE", "DOULEUR", "FORCE", "ENDURANCE", "POSTURE"] as const).map((o) => (
            <Pressable key={o} onPress={() => setObjectif(o)} style={chip(objectif === o)}>
              <Text style={{ color: colors.text }}>{o}</Text>
            </Pressable>
          ))}
        </View>

        <Subtitle>Temps disponible</Subtitle>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {(["MOINS_10", "DIX_20", "VINGT_30", "PLUS_30"] as const).map((t) => (
            <Pressable key={t} onPress={() => setTemps(t)} style={chip(temps === t)}>
              <Text style={{ color: colors.text }}>{t}</Text>
            </Pressable>
          ))}
        </View>

        <Subtitle>Lieu</Subtitle>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {(["MAISON", "SALLE", "EXTERIEUR"] as const).map((l) => (
            <Pressable key={l} onPress={() => setLieu(l)} style={chip(lieu === l)}>
              <Text style={{ color: colors.text }}>{l}</Text>
            </Pressable>
          ))}
        </View>

        <Subtitle>Niveau activité</Subtitle>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {(["INACTIF", "SEDENTAIRE", "ACTIF"] as const).map((n) => (
            <Pressable key={n} onPress={() => setNiveau(n)} style={chip(niveau === n)}>
              <Text style={{ color: colors.text }}>{n}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable onPress={() => setConsent((v) => !v)} style={{ marginTop: 14 }}>
          <Text style={{ color: colors.text }}>
            {consent ? "✅" : "⬜"} J'accepte le consentement RGPD (v1.0)
          </Text>
        </Pressable>

        {error ? <DangerText>{error}</DangerText> : null}
        <PrimaryButton title="Continuer" onPress={onSave} loading={loading} />
      </Card>
    </Screen>
  );
}
