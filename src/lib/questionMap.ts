export interface QuestionDef {
  match: string
  code: string
  title: string
  category: string
  isBewijsstuk?: boolean
  bewijsstukFor?: string
}

export const QUESTION_MAP: QuestionDef[] = [
  // ── Categorie A ────────────────────────────────────────────────────────────
  {
    match: 'arbeidsplaatsen per hectare',
    code: 'A1',
    title: 'Aantal arbeidsplaatsen per hectare',
    category: 'A. Goed werkgeverschap en onderwijs',
  },
  {
    match: 'Accountantsverklaring aantal directe',
    code: 'A1_bewijs',
    title: 'Bewijsstuk: accountantsverklaring arbeidsplaatsen',
    category: 'A. Goed werkgeverschap en onderwijs',
    isBewijsstuk: true,
    bewijsstukFor: 'A1',
  },
  {
    match: 'percentage medewerkers',
    code: 'A2',
    title: 'Percentage medewerkers mbo/hbo > 30%?',
    category: 'A. Goed werkgeverschap en onderwijs',
  },
  {
    match: 'Accountantsverklaring percentage medewerkers',
    code: 'A2_bewijs',
    title: 'Bewijsstuk: accountantsverklaring % mbo/hbo',
    category: 'A. Goed werkgeverschap en onderwijs',
    isBewijsstuk: true,
    bewijsstukFor: 'A2',
  },
  {
    match: 'erkend leerbedrijf',
    code: 'A3',
    title: 'Erkend leerbedrijf?',
    category: 'A. Goed werkgeverschap en onderwijs',
  },
  {
    match: 'SBB-certificaat',
    code: 'A3_bewijs',
    title: 'Bewijsstuk: officieel SBB-certificaat',
    category: 'A. Goed werkgeverschap en onderwijs',
    isBewijsstuk: true,
    bewijsstukFor: 'A3',
  },
  {
    match: 'onderwijsinstelling',
    code: 'A4',
    title: 'Samenwerking met onderwijsinstelling?',
    category: 'A. Goed werkgeverschap en onderwijs',
  },
  {
    match: 'aantoonbare samenwerking met een onderwijsinstelling',
    code: 'A4_bewijs',
    title: 'Bewijsstuk: samenwerking onderwijsinstelling',
    category: 'A. Goed werkgeverschap en onderwijs',
    isBewijsstuk: true,
    bewijsstukFor: 'A4',
  },
  {
    match: 'maatschappelijke partijen',
    code: 'A5',
    title: 'Samenwerking met maatschappelijke partijen?',
    category: 'A. Goed werkgeverschap en onderwijs',
  },
  {
    match: 'beleidsplan, convenant',
    code: 'A5_bewijs',
    title: 'Bewijsstuk: beleidsplan / convenant',
    category: 'A. Goed werkgeverschap en onderwijs',
    isBewijsstuk: true,
    bewijsstukFor: 'A5',
  },
  {
    match: 'MVO-certificaat',
    code: 'A6',
    title: 'MVO-certificaat aanwezig?',
    category: 'A. Goed werkgeverschap en onderwijs',
  },
  {
    match: 'certificaat prestatieladder',
    code: 'A6_bewijs',
    title: 'Bewijsstuk: certificaat prestatieladder',
    category: 'A. Goed werkgeverschap en onderwijs',
    isBewijsstuk: true,
    bewijsstukFor: 'A6',
  },

  // ── Categorie B ────────────────────────────────────────────────────────────
  {
    match: 'niet verder groeien',
    code: 'B1',
    title: 'Groeibelemmering in Dordrecht?',
    category: 'B. Bijdrage aan de stad en regio',
  },
  {
    match: 'koplopersproject',
    code: 'B2',
    title: 'Invulling koplopersproject Sectoragenda Maritieme Maakindustrie?',
    category: 'B. Bijdrage aan de stad en regio',
  },
  {
    match: 'nieuwe (bouw)investeringen',
    code: 'B3',
    title: 'Perspectief op nieuwe bouw- en economische investeringen?',
    category: 'B. Bijdrage aan de stad en regio',
  },
  {
    match: 'speerpunten van de Dordtse economie',
    code: 'B4',
    title: 'Bedrijf actief op speerpunt Dordtse economie?',
    category: 'B. Bijdrage aan de stad en regio',
  },
  {
    match: 'kadegebruik',
    code: 'B5',
    title: 'Intensief watergebonden ontsluiting en kadegebruik?',
    category: 'B. Bijdrage aan de stad en regio',
  },

  // ── Categorie C ────────────────────────────────────────────────────────────
  {
    match: 'CO2-prestatieladder',
    code: 'C1',
    title: 'CO2-prestatieladder hoger dan niveau 3?',
    category: 'C. Duurzaamheid en klimaatadaptatie',
  },
  {
    match: 'verduurzaming, innovatie en energietransitie',
    code: 'C2',
    title: 'Deelname Europese/nationale verduurzamingsprogramma\'s?',
    category: 'C. Duurzaamheid en klimaatadaptatie',
  },
  {
    match: 'BREEAM',
    code: 'C3',
    title: 'Gebouw voldoet aan BREEAM-criteria bij oplevering?',
    category: 'C. Duurzaamheid en klimaatadaptatie',
  },
  {
    match: 'energieneutraal',
    code: 'C4',
    title: 'Bedrijfspand energieneutraal ontwikkelen?',
    category: 'C. Duurzaamheid en klimaatadaptatie',
  },

  // ── Categorie D ────────────────────────────────────────────────────────────
  {
    match: 'GroenvermogenNL',
    code: 'D1',
    title: 'Invulling strategische doelstellingen GroenvermogenNL (waterstof)?',
    category: 'D. Schone mobiliteit',
  },
  {
    match: 'parkeerplaatsen',
    code: 'D2',
    title: 'Meer dan 40% parkeerplekken met elektrische laadpaal?',
    category: 'D. Schone mobiliteit',
  },

  // ── Categorie E ────────────────────────────────────────────────────────────
  {
    match: 'participatieplan',
    code: 'E1',
    title: 'Participatieplan voor omwonenden/belanghebbenden aanwezig?',
    category: 'E. Participatie',
  },

  // ── Categorie F ────────────────────────────────────────────────────────────
  {
    match: 'perceel volledig af te nemen',
    code: 'F1',
    title: 'Voornemen perceel volledig af te nemen?',
    category: 'F. Randvoorwaarden uitgifte',
  },
  {
    match: 'kadeconstructie',
    code: 'F2',
    title: 'Bereid tot volledige eigen investering in kadeconstructie?',
    category: 'F. Randvoorwaarden uitgifte',
  },

  // ── Categorie G ────────────────────────────────────────────────────────────
  {
    match: 'G-1',
    code: 'G1',
    title: 'Visiedocument',
    category: 'G. Documenten',
  },
  {
    match: 'G-2',
    code: 'G2',
    title: 'Visiedocument bijlage',
    category: 'G. Documenten',
  },
]

export const CATEGORY_ORDER = [
  'A. Goed werkgeverschap en onderwijs',
  'B. Bijdrage aan de stad en regio',
  'C. Duurzaamheid en klimaatadaptatie',
  'D. Schone mobiliteit',
  'E. Participatie',
  'F. Randvoorwaarden uitgifte',
  'G. Documenten',
]
