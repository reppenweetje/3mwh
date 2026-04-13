export interface LeadSummary {
  match: string
  text: string
}

export const LEAD_SUMMARIES: LeadSummary[] = [
  {
    match: 'Van den Herik',
    text: 'Van den Herik wil op het perceel een extra productielocatie voor civiele en maritieme staalconstructies ontwikkelen. Het plan bestaat uit twee moderne bedrijfshallen met kantoorfunctie, gericht op fabricage, assemblage en logistiek van grote constructies zoals brugdelen, sluisdeuren, remmingwerken en sectiebouw voor scheepsbouw. De locatie is bedoeld als watergebonden productiesite waar zware constructies rechtstreeks via pontons en schepen kunnen worden afgevoerd. Zij zetten in op een energieneutrale inrichting en zijn bereid te investeren in kade en infrastructuur.',
  },
  {
    match: 'Koedood',
    text: 'Koedood wil samen met Jooren en Sinttruije de Drechtsteden Green Maritime Hub realiseren: een gezamenlijke service- en innovatielocatie voor de maritieme sector. De hub richt zich op service, onderhoud, revisie, retrofit, hermotorisering, afbouw en technische integratie van schepen, aangevuld met testfaciliteiten, R&D en onderwijs. Het plan brengt de volledige maritieme aandrijflijn samen op één locatie, van motorisatie en emissietechniek tot voortstuwing. Daarnaast zetten zij in op verduurzaming, innovatie en de ontwikkeling van oplossingen rond elektrificatie, alternatieve brandstoffen en waterstof.',
  },
  {
    match: 'Quay Vastgoed',
    text: 'Zij willen een hoogwaardig nautisch cluster ontwikkelen, gericht op maritieme maakindustrie, refit, reparatie, afbouw, assemblage en het testen van maritieme technologie. De kern van hun plan is een toekomstbestendig maritiem ecosysteem met intensief kadegebruik, private investering in de kade en een sterke koppeling met onderwijs en innovatie. Daarnaast zien zij op de locatie ruimte voor een nautisch verkeers- en leercentrum met simulatoren, digital twin-toepassingen en samenwerking met onderwijsinstellingen.',
  },
  {
    match: 'Jury Architecture',
    text: 'Greenport wil een complementaire binnenvaartcampus ontwikkelen als satelliet van Greenport Rotterdam. Het concept is een geïntegreerd maritiem servicecluster voor binnenvaart en near-coastal shipping, met gedeelde kadefaciliteiten, hallen, kantoorruimte, energievoorzieningen en ondersteunende infrastructuur. Het plan draait om clustering van meerdere complementaire bedrijven in onderhoud, retrofit, installaties, service en verduurzaming. Ook onderwijs, innovatie en mogelijk ontgassingsinfrastructuur maken onderdeel uit van de bredere visie.',
  },
  {
    match: 'Holland Shipyards',
    text: 'Holland Shipyards wil een watergebonden industriële hub, ofwel werf van de toekomst, realiseren. De focus ligt op duurzame scheepsbouw, de bouw en afbouw van drijvende betonconstructies, trainingsplatforms, drijvende objecten en een 3D-printstraat voor grootformaat componenten en mogelijk volledig geprinte schepen. De kade wordt daarbij gezien als productiestraat voor bouw, afbouw, testen en logistiek. Daarnaast willen zij de locatie koppelen aan onderwijs als satelliet van Smart Campus Leerpark.',
  },
  {
    match: 'HVC',
    text: 'HVC wil van de locatie een strategische CO₂-hub maken voor ontvangst, vervloeiing, tijdelijke opslag en overslag van afgevangen CO₂, met transport primair via de binnenvaart. Het plan hangt samen met de CO₂-afvang bij de afvalenergiecentrale van HVC in Dordrecht en moet een schakel worden in de Nederlandse en Noordwest-Europese CCUS-keten. De locatie wordt daarmee geen klassiek maritiem maakcluster, maar een watergebonden energie- en klimaatinfrafunctie met cryogene installaties, opslagtanks en laad- en losfaciliteiten aan de kade.',
  },
  {
    match: 'Dolpower',
    text: 'Dolpower wil een eigen watergebonden vestiging ontwikkelen voor complete energievoorzienings- en voortstuwingssystemen voor de binnenvaart. Op de locatie willen zij een assemblagehal, werkplaats, opslag, kantoor en kadefaciliteiten realiseren voor installatie van generatorsets en voortstuwingsmotoren, afbouw en integratie van installaties, testen, inbedrijfstelling en service, refit en retrofit. De locatie moet Dolpower in staat stellen om projecten volledig in eigen beheer uit te voeren en verder te groeien als leverancier van hybride systemen, accupakketten en energiemanagementoplossingen.',
  },
]

export function getSummary(bedrijf: string): string | undefined {
  return LEAD_SUMMARIES.find((s) =>
    bedrijf.toLowerCase().includes(s.match.toLowerCase())
  )?.text
}
