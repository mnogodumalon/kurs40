// Auto-generated TypeScript types for LivingApps

export const APP_IDS = {
  DOZENTEN: "698efdf6780ae395f0cf30eb",
  RAEUME: "698efdf7271269dd00ef584a",
  TEILNEHMER: "698efdf774fe859069016ec6",
  KURSE: "698efdf7c1b97696d8ccc11a",
  ANMELDUNGEN: "698efdf8380680581fa6c950",
} as const;

export interface Dozenten {
  record_id: string;
  fields: {
    name: string | null;
    email: string | null;
    telefon: string | null;
    fachgebiet: string | null;
  };
}

export interface Raeume {
  record_id: string;
  fields: {
    raumname: string | null;
    gebaeude: string | null;
    kapazitaet: number | null;
  };
}

export interface Teilnehmer {
  record_id: string;
  fields: {
    name: string | null;
    email: string | null;
    telefon: string | null;
    geburtsdatum: string | null;
  };
}

export interface Kurse {
  record_id: string;
  fields: {
    titel: string | null;
    beschreibung: string | null;
    dozent: string | null;
    raum: string | null;
    startdatum: string | null;
    enddatum: string | null;
    max_teilnehmer: number | null;
    preis: number | null;
  };
}

export interface Anmeldungen {
  record_id: string;
  fields: {
    teilnehmer: string | null;
    kurs: string | null;
    anmeldedatum: string | null;
    bezahlt: boolean | null;
  };
}

