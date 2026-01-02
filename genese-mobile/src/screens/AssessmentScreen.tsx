import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Field } from "../utils/Form";
import { Card, DangerText, PrimaryButton, Screen, Subtitle, Title } from "../utils/ui";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../context/AuthContext";

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function AssessmentScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { api, setFlow } = useAuth();

  // Very simplified inputs (you can expand to match your web prototype UI)
  const [douleurMob, setDouleurMob] = useState("2");
  const [douleurSta, setDouleurSta] = useState("3");
  const [equilibreSec, setEquilibreSec] = useState("20");
  const [douleurCon, setDouleurCon] = useState("0");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    if (!api) return;
    setLoading(true);
    setError(null);

    const res = await api.createBilan({
      type_bilan: "AUTO_COMPLET",
      date_bilan: todayISO(),
      tests: [
        {
          type_test: "MOBILITE",
          zone_corps: "RACHIS",
          amplitude: "MOYENNE",
          fluidite: "MOYENNE",
          sensation: "NEUTRE",
          asymetrie_flag: false,
          douleur_nrs: Number(douleurMob),
        },
        {
          type_test: "STABILITE",
          zone_corps: "CHEVILLE",
          amplitude: "MOYENNE",
          fluidite: "MOYENNE",
          sensation: "NEUTRE",
          asymetrie_flag: true,
          douleur_nrs: Number(douleurSta),
          duree_equilibre_sec: Number(equilibreSec),
        },
        {
          type_test: "CONSCIENCE",
          zone_corps: "EPAULE",
          amplitude: "BONNE",
          fluidite: "BONNE",
          sensation: "BONNE",
          asymetrie_flag: false,
          douleur_nrs: Number(douleurCon),
        }
      ],
    });

    setLoading(false);

    if (!res.success) {
      setError(res.error.message);
      return;
    }

    setFlow({ bilanId: res.data._id });
    nav.navigate("Results");
  }

  return (
    <Screen>
      <Title>Auto-bilan</Title>
      <Subtitle>POST /bilans — crée aussi ResultatTest(s) + scores + alertes si douleur ≥ 7</Subtitle>

      <Card>
        <Subtitle>Mobilité (douleur 0-10)</Subtitle>
        <Field label="Douleur NRS" value={douleurMob} onChangeText={setDouleurMob} keyboardType="numeric" />

        <Subtitle>Stabilité</Subtitle>
        <Field label="Douleur NRS" value={douleurSta} onChangeText={setDouleurSta} keyboardType="numeric" />
        <Field label="Durée équilibre (sec)" value={equilibreSec} onChangeText={setEquilibreSec} keyboardType="numeric" />

        <Subtitle>Conscience corporelle</Subtitle>
        <Field label="Douleur NRS" value={douleurCon} onChangeText={setDouleurCon} keyboardType="numeric" />

        {error ? <DangerText>{error}</DangerText> : null}
        <PrimaryButton title="Valider le bilan" onPress={onSubmit} loading={loading} />
      </Card>
    </Screen>
  );
}
