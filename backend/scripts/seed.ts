import dotenv from "dotenv";
dotenv.config();

import { connectMongo } from "../src/config/mongoose";
import { env } from "../src/config/env";
import { Administrateur } from "../src/models/administrateur.model";
import { Exercice } from "../src/models/exercice.model";
import { hashPassword } from "../src/utils/password";
import { Role, PhaseProgramme, ZoneCorps } from "../src/constants/enums";

async function main() {
  await connectMongo(env.MONGODB_URI);

  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@genese.local";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "AdminPassword123!";

  const existing = await Administrateur.findOne({ email });
  if (!existing) {
    await Administrateur.create({
      email,
      mot_de_passe_hash: await hashPassword(password),
      role: Role.ADMIN
    });
    // eslint-disable-next-line no-console
    console.log("Seed admin created:", email);
  }

  const count = await Exercice.countDocuments();
  if (count < 10) {
    const base = [
      { phase: PhaseProgramme.PHASE_1, zone: ZoneCorps.RACHIS },
      { phase: PhaseProgramme.PHASE_1, zone: ZoneCorps.HANCHE },
      { phase: PhaseProgramme.PHASE_2, zone: ZoneCorps.EPAULE },
      { phase: PhaseProgramme.PHASE_2, zone: ZoneCorps.GENOU },
      { phase: PhaseProgramme.PHASE_3, zone: ZoneCorps.CHEVILLE }
    ];

    await Exercice.insertMany(
      Array.from({ length: 15 }).map((_, i) => {
        const p = base[i % base.length];
        return {
          titre: `Exercice ${i + 1}`,
          description: "Exercice de démonstration pour GENESE.",
          phase_cible: p.phase,
          zone_cible: p.zone,
          niveau_min: 1,
          niveau_max: 10,
          url_video: "https://example.com/video.mp4",
          duree_recommandee_sec: 45,
          valide_securite: true
        };
      })
    );
    // eslint-disable-next-line no-console
    console.log("Seed exercises inserted");
  }

  process.exit(0);
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});