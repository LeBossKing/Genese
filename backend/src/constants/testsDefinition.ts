import { TypeTest, ZoneCorps } from "./enums";

export const testsDefinition = [
  {
    type_test: TypeTest.MOBILITE,
    label: "Bilan de mobilité",
    tests: [
      { zone_corps: ZoneCorps.RACHIS, label: "Flexion rachis" },
      { zone_corps: ZoneCorps.HANCHE, label: "Mobilité hanche" }
    ]
  },
  {
    type_test: TypeTest.STABILITE,
    label: "Bilan de stabilité",
    tests: [
      { zone_corps: ZoneCorps.CHEVILLE, label: "Équilibre unipodal" },
      { zone_corps: ZoneCorps.GENOU, label: "Stabilité genou" }
    ]
  },
  {
    type_test: TypeTest.CONSCIENCE,
    label: "Bilan de conscience corporelle",
    tests: [
      { zone_corps: ZoneCorps.EPAULE, label: "Contrôle scapulaire" },
      { zone_corps: ZoneCorps.RACHIS, label: "Respiration / gainage" }
    ]
  }
] as const;